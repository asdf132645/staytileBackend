import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { PageView } from './entities/page-view.entity';

const KST = 9 * 60 * 60 * 1000;

/** KST 기준 오늘 자정을 UTC Date로 반환 */
function kstTodayStart(): Date {
  const kstNow = new Date(Date.now() + KST);
  return new Date(
    Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate()) - KST,
  );
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private readonly repo: Repository<PageView>,
  ) {}

  async track(ip: string, path: string, userAgent: string | null, referer: string | null) {
    // 같은 IP → KST 기준 오늘 하루 중복 무시
    const todayStart = kstTodayStart();
    const recent = await this.repo.findOne({
      where: { ip, createdAt: MoreThanOrEqual(todayStart) },
    });
    if (recent) return;

    await this.repo.save({ ip, path, userAgent, referer });
  }

  async getStats(period: 'today' | 'week' | 'month' | 'all') {
    let from: Date | null = null;

    if (period === 'today') {
      from = kstTodayStart();
    } else if (period === 'week') {
      from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const where = from ? { createdAt: MoreThanOrEqual(from) } : {};
    const rows = await this.repo.find({ where, order: { createdAt: 'ASC' } });

    // KST 날짜 문자열로 변환
    const toKstDay = (d: Date) =>
      new Date(d.getTime() + KST).toISOString().slice(0, 10);

    const uniqueByDay = new Map<string, Set<string>>();
    const ipSet = new Set<string>();
    const pageCount = new Map<string, number>();

    for (const r of rows) {
      const day = toKstDay(r.createdAt);
      if (!uniqueByDay.has(day)) uniqueByDay.set(day, new Set());
      uniqueByDay.get(day)!.add(r.ip);
      ipSet.add(r.ip);
      pageCount.set(r.path, (pageCount.get(r.path) ?? 0) + 1);
    }

    const dailyChart = Array.from(uniqueByDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, ips]) => ({ date, visitors: ips.size }));

    const topPages = Array.from(pageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([path, views]) => ({ path, views }));

    return {
      totalViews: rows.length,
      uniqueVisitors: ipSet.size,
      dailyChart,
      topPages,
    };
  }
}
