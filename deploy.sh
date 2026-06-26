#!/bin/bash
# ──────────────────────────────────────────────────────────────
# AWS Lightsail 배포 스크립트 (서버에서 직접 실행)
# 사용법: bash deploy.sh
# ──────────────────────────────────────────────────────────────
set -e

echo "▶ 최신 코드 pull..."
git pull origin main

echo "▶ Docker 이미지 빌드..."
docker compose build --no-cache api

echo "▶ 컨테이너 재시작 (DB는 유지, API만 재배포)..."
docker compose up -d --no-deps api

echo "▶ 오래된 이미지 정리..."
docker image prune -f

echo "✅ 배포 완료!"
docker compose ps
