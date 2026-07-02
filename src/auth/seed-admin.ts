/**
 * 최초 어드민 계정 생성 스크립트
 * 실행: npx ts-node -e "require('./src/auth/seed-admin')"
 * 또는 API가 기동 중일 때:
 *   curl -X POST https://api.staytile.com/api/auth/register \
 *        -H "Content-Type: application/json" \
 *        -d '{"email":"admin@staytile.com","password":"Admin1234!","name":"관리자"}'
 *
 * 그 후 DB에서 직접 role을 ADMIN으로 변경:
 *   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@staytile.com';
 */
export {};
