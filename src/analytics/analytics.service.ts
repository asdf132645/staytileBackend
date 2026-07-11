import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { PageView } from './entities/page-view.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private readonly repo: Repository<PageView>,
  ) {}

  async track(ip: string, path: string, userAgent: string | null, referer: string | null) {
    // 같은 IP → 오늘 하루 중복 무시 (path 무관)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const recent = await this.repo.findOne({
      where: { ip, createdAt: MoreThanOrEqual(todayStart) },
    });
    if (recent) return;

    await this.repo.save({ ip, path, userAgent, referer });
  }

  async getStats(period: 'today' | 'week' | 'month' | 'all') {
    const now = new Date();
    let from: Date | null = null;

    if (period === 'today') {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const where = from ? { createdAt: MoreThanOrEqual(from) } : {};
    const rows = await this.repo.find({ where, order: { createdAt: 'ASC' } });

    // 유니크 방문자 (IP 기준, 날짜별 1회)
    const uniqueByDay = new Map<string, Set<string>>();
    const ipSet = new Set<string>();
    const pageCount = new Map<string, number>();

    for (const r of rows) {
      const day = r.createdAt.toISOString().slice(0, 10);
      if (!uniqueByDay.has(day)) uniqueByDay.set(day, new Set());
      uniqueByDay.get(day)!.add(r.ip);
      ipSet.add(r.ip);

      const p = r.path;
      pageCount.set(p, (pageCount.get(p) ?? 0) + 1);
    }

    // 일별 유니크 방문자 차트용
    const dailyChart = Array.from(uniqueByDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, ips]) => ({ date, visitors: ips.size }));

    // 인기 페이지 top 20
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
