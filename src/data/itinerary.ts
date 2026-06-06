import type { Day } from '../types/itinerary'

/** Day-indexed accent colors — sea palette */
export const DAY_COLORS: Record<number, string> = {
  1: '#2f8f9d',
  2: '#cf8a4c',
  3: '#4f74a8',
  4: '#6f9a64',
  5: '#b06d86',
}

/**
 * Mock itinerary data.
 * transport.detail fields are marked [mock] — replace with real transit data.
 * spot coordinates are approximate for shooting ranges & hotel — calibrate with exact addresses.
 */
export const DAYS: Day[] = [
  {
    id: 1,
    date: '6.9',
    title: '抵达济州',
    en: 'Arrival',
    note: '浦东 05:05 起飞 · 济州 07:15 落地',
    spots: [
      {
        name: '济州国际机场',
        en: 'Jeju Intl Airport',
        kr: '제주국제공항',
        lat: 33.5113,
        lng: 126.4930,
        time: '07:15 落地',
        to: {
          m: 'car',
          label: '机场巴士 / 打车 约25分',
          detail: {
            rows: [
              ['方式', '机场巴士 600 / 出租车'],
              ['上车', '济州机场 5 号巴士站'],
              ['下车', '市区酒店站 (约 8 站)'],
              ['车程', '约 25 分'],
              ['花费', '巴士 ₩5,500 / 打车 ₩15,000'],
            ],
            tip: '拖行李建议直接打车，3 人即划算', // [mock]
          },
        },
      },
      {
        name: '酒店入住',
        en: 'Check-in · Jeju City',
        kr: '제주시',
        lat: 33.4996,
        lng: 126.5312,
        time: '上午 入住',
        note: '看精力 玩半天',
      },
    ],
  },
  {
    id: 2,
    date: '6.10',
    title: '东线一日',
    en: 'East Coast',
    note: '全程公交 201',
    spots: [
      {
        name: '咸德海水浴场',
        en: 'Hamdeok Beach',
        kr: '함덕해수욕장',
        lat: 33.5435,
        lng: 126.6694,
        time: '上午',
        to: {
          m: 'bus',
          label: '公交 201',
          detail: {
            rows: [
              ['上车', '咸德海水浴场 (함덕해수욕장)'],
              ['路线', '201 路 · 往城山方向'],
              ['下车', '月汀里 (월정리해변)'],
              ['班次', '约 20 分一班'],
              ['车程', '约 18 分 · ₩1,500'],
            ],
            tip: 'T-money 卡可直接刷，上下车各刷一次', // [mock]
          },
        },
      },
      {
        name: '月汀里·小狗咖啡店',
        en: 'Woljeongri Cafe',
        kr: '월정리',
        lat: 33.5563,
        lng: 126.7958,
        time: '午后',
        note: '可选',
        to: {
          m: 'bus',
          label: '公交 201',
          detail: {
            rows: [
              ['上车', '月汀里 (월정리)'],
              ['路线', '201 路 · 往城山方向'],
              ['下车', '城山日出峰入口 (성산일출봉)'],
              ['车程', '约 40 分 · ₩1,500'],
            ], // [mock]
          },
        },
      },
      {
        name: '城山日出峰',
        en: 'Seongsan Ilchulbong',
        kr: '성산일출봉',
        lat: 33.4581,
        lng: 126.9425,
        time: '下午',
        to: {
          m: 'bus',
          label: '201 + 接驳',
          detail: {
            rows: [
              ['上车', '城山日出峰 (성산일출봉)'],
              ['路线', '201 路 / 换乘当地接驳车'],
              ['下车', '涉地可支 (섭지코지)'],
              ['车程', '约 15 分 · 也可步行'],
            ], // [mock]
          },
        },
      },
      {
        name: '涉地可支',
        en: 'Seopjikoji',
        kr: '섭지코지',
        lat: 33.4236,
        lng: 126.9292,
        time: '傍晚',
      },
    ],
  },
  {
    id: 3,
    date: '6.11',
    title: '牛岛一日',
    en: 'Udo Island',
    note: '城山港乘船登岛',
    spots: [
      {
        name: '城山港 → 牛岛',
        en: 'Seongsan → Udo Ferry',
        kr: '성산항',
        lat: 33.4744,
        lng: 126.9300,
        time: '上午 乘轮渡',
        to: {
          m: 'boat',
          label: '轮渡 约15分',
          detail: {
            rows: [
              ['码头', '城山浦港 客运站 (성산포항)'],
              ['班次', '每 30 分一班 · 08:00–17:30'],
              ['航程', '约 15 分'],
              ['票价', '往返 ₩10,500 (含登岛费)'],
            ],
            tip: '需带护照购票，当天往返保留船票', // [mock]
          },
        },
      },
      {
        name: '环岛助力车自由行',
        en: 'Udo Scooter Loop',
        kr: '우도',
        lat: 33.5042,
        lng: 126.9530,
        time: '白天',
        to: {
          m: 'scooter',
          label: '电动助力车',
          detail: {
            rows: [
              ['租车', '下牛木洞码头 租赁点'],
              ['车型', '电动助力车 / 双人座'],
              ['租金', '₩20,000 / 2 小时'],
              ['环岛', '约 17km · 全程 2–3 小时'],
            ],
            tip: '需国际驾照，沿海岸线顺时针骑', // [mock]
          },
        },
      },
      {
        name: '小猫快艇',
        en: 'Speedboat',
        kr: '우도 보트',
        lat: 33.5150,
        lng: 126.9605,
        time: '午后',
      },
    ],
  },
  {
    id: 4,
    date: '6.12',
    title: '西南线一日',
    en: 'Southwest',
    note: '建议自驾',
    spots: [
      {
        name: 'Daeyu 大侑狩猎场',
        en: 'Daeyu Shooting',
        kr: '대유랜드',
        lat: 33.2925,
        lng: 126.4170,
        time: '上午',
        note: '霰弹枪 + 步枪',
        to: {
          m: 'car',
          label: '自驾 约25分',
          detail: {
            rows: [
              ['方式', '自驾'],
              ['距离', '约 18km'],
              ['车程', '约 25 分'],
              ['路线', '沿 1136 / 平和路'],
            ], // [mock]
          },
        },
      },
      {
        name: 'Siltan 手枪靶场',
        en: 'Siltan Range',
        kr: '실탄사격',
        lat: 33.2520,
        lng: 126.5090,
        time: '午前',
        note: '手枪',
        to: {
          m: 'car',
          label: '自驾 约35分',
          detail: {
            rows: [
              ['方式', '自驾'],
              ['距离', '约 28km'],
              ['车程', '约 35 分'],
              ['停车', '馆前免费停车场'],
            ], // [mock]
          },
        },
      },
      {
        name: 'osulloc 雪绿茶博物馆',
        en: "O'sulloc Tea Museum",
        kr: '오설록',
        lat: 33.3057,
        lng: 126.2897,
        time: '午后',
        note: '南线可选',
        to: {
          m: 'car',
          label: '自驾 约30分',
          detail: {
            rows: [
              ['方式', '自驾'],
              ['距离', '约 24km'],
              ['车程', '约 30 分'],
            ], // [mock]
          },
        },
      },
      {
        name: '柱状节理带',
        en: 'Jusangjeolli Cliff',
        kr: '주상절리',
        lat: 33.2378,
        lng: 126.4267,
        time: '下午',
        note: '南线可选',
        to: {
          m: 'car',
          label: '自驾 约30分',
          detail: {
            rows: [
              ['方式', '自驾'],
              ['距离', '约 26km'],
              ['车程', '约 30 分'],
              ['停车', '中文旅游区停车场'],
            ], // [mock]
          },
        },
      },
      {
        name: '挟才海水浴场',
        en: 'Hyeopjae Beach',
        kr: '협재해수욕장',
        lat: 33.3939,
        lng: 126.2396,
        time: '黄昏',
        note: '西线可选',
      },
    ],
  },
  {
    id: 5,
    date: '6.13',
    title: '返程',
    en: 'Departure',
    note: '济州 07:25 起飞 · 浦东 07:55 落地',
    spots: [
      {
        name: '酒店退房',
        en: 'Check-out',
        kr: '체크아웃',
        lat: 33.4996,
        lng: 126.5312,
        time: '清晨',
        to: {
          m: 'car',
          label: '前往机场 约20分',
          detail: {
            rows: [
              ['方式', '出租车 / 酒店接驳'],
              ['距离', '约 12km'],
              ['车程', '约 20 分'],
              ['花费', '打车约 ₩12,000'],
            ],
            tip: '国际航班建议提前 2 小时到机场', // [mock]
          },
        },
      },
      {
        name: '济州国际机场',
        en: 'Jeju Intl Airport',
        kr: '제주국제공항',
        lat: 33.5113,
        lng: 126.4930,
        time: '07:25 起飞',
        note: '浦东 T2 · 07:55 落地',
        to: {
          m: 'plane',
          label: '济州 → 上海浦东 T2',
          detail: {
            rows: [
              ['航站楼', '济州机场 国际线航站楼'],
              ['起飞', '06.13 07:25 (济州时间)'],
              ['到达', '浦东 T2 · 07:55 (北京时间 06:25)'],
              ['航程', '约 1 小时'],
            ],
            tip: '济州与北京时差 1 小时', // [mock]
          },
        },
      },
    ],
  },
]
