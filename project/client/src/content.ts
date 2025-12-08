export type Feature = {
  title: string
  copy: string
}

export type LeaderboardRow = {
  name: string
  xp: string
  status: string
}

export const featureHighlights: Feature[] = [
  {
    title: 'Bài học theo nhiệm vụ',
    copy: 'Mở khóa truyện ngắn, luyện phát âm và văn hóa khi bạn thăng cấp.',
  },
  {
    title: 'Ghi nhớ bằng hình ảnh',
    copy: 'Ghép từ vựng với hình khối và sắc màu gợi nhớ thiên nhiên Việt Nam.',
  },
  {
    title: 'XP, chuỗi ngày, huy hiệu',
    copy: 'Chuỗi ngày, vương miện và thử thách đội nhóm giữ bạn quay lại mỗi ngày.',
  },
]

export const steps: string[] = [
  'Chọn hành trình: du lịch, nối nguồn cội, hay luyện thi.',
  'Hoàn thành nhiệm vụ 10 phút với nghe, nói và ghi nhớ.',
  'Giữ chuỗi ngày và mở khóa quà mùa vụ trong tinh thần “Bloom”.',
]

export const leaderboard: LeaderboardRow[] = [
  { name: 'Lan Anh', xp: '12,450 XP', status: '🌱 Đang nảy' },
  { name: 'Minh Trần', xp: '10,980 XP', status: '🍊 Rực rỡ' },
  { name: 'Hành trình', xp: '9,120 XP', status: '🍃 Bền bỉ' },
]

