# NEEDS_API

아래 함수들은 다른 Agent가 `src/shared/api/` 파일에 추가해야 합니다.

## review.ts 추가 필요 함수 (후기등록 Agent용)
- POST /api/reviews (createReview)
- PATCH /api/reviews/{id} (updateReview)
- DELETE /api/reviews/{id} (deleteReview)
- POST /api/receipts (registerReceipt)
