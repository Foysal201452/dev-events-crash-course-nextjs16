export type EventItem = {
    title:string;
    image:string;
    slug:string;
    location:string;
    date:string;
    time:string;
}

export const events: EventItem[] = [
  {
    image: '/images/event1.png',
    title: 'React Summit 2026',
    slug: 'react-summit-2026',
    location: 'Amsterdam, Netherlands',
    date: '2026-06-15',
    time: '09:00 AM - 6:00 PM',
  },
  {
    image: '/images/event2.png',
    title: 'Google I/O Extended',
    slug: 'google-io-extended',
    location: 'San Francisco, CA, USA',
    date: '2026-05-20',
    time: '10:00 AM - 5:00 PM',
  },
  {
    image: '/images/event3.png',
    title: 'Hack The Future',
    slug: 'hack-the-future',
    location: 'Berlin, Germany',
    date: '2026-07-10',
    time: '08:00 AM - 8:00 PM',
  },
  {
    image: '/images/event4.png',
    title: 'PyCon Global',
    slug: 'pycon-global',
    location: 'London, UK',
    date: '2026-09-05',
    time: '09:30 AM - 5:30 PM',
  },
  {
    image: '/images/event5.png',
    title: 'DevOps World',
    slug: 'devops-world',
    location: 'New York, NY, USA',
    date: '2026-08-18',
    time: '09:00 AM - 6:00 PM',
  },
  {
    image: '/images/event6.png',
    title: 'Women Who Code Connect',
    slug: 'wwc-connect',
    location: 'Toronto, Canada',
    date: '2026-10-12',
    time: '10:00 AM - 4:00 PM',
  },
];