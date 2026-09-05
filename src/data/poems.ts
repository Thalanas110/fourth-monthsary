export type Poem = {
  id: string;
  title: string;
  author: string;
  mood: string;
  kind: 'poem' | 'song';
  length: string;
  excerpt: string;
  body: string;
};

export const poems: Poem[] = [
  {
    id: 'blue-hour', title: 'Blue Hour', author: 'Mara Ellison', mood: 'Longing', kind: 'poem', length: '2 min read',
    excerpt: 'The day leaves by the river, carrying all the words we did not say.',
    body: `The day leaves by the river,
carrying all the words
we did not say.

I watch the water turn them over—
small silver things,
still warm from the mouth.

By morning, perhaps,
they will have found a shore
where someone is listening.`,
  },
  {
    id: 'the-last-light', title: 'The Last Light', author: 'Jonas Wren', mood: 'Stillness', kind: 'poem', length: '3 min read',
    excerpt: 'At the edge of the evening, even the windows seem to be holding their breath.',
    body: `At the edge of the evening,
the windows hold their breath.

One by one, the rooms
let go of their small suns.
One by one, the street
becomes a thought.

Stay here a moment.
There is nothing to solve
in the softening world.`,
  },
  {
    id: 'small-weather', title: 'Small Weather', author: 'Nia Okafor', mood: 'Tenderness', kind: 'poem', length: '2 min read',
    excerpt: 'You bring the rain in on your shoulders. I make a place for it beside me.',
    body: `You bring the rain in
on your shoulders.

I make a place for it
beside me,
under the yellow lamp.

Outside, the city keeps
its appointment with the dark.
Inside, we are learning
the weather of one another.`,
  },
  {
    id: 'after-the-rain', title: 'After the Rain', author: 'Theo Bell', mood: 'Renewal', kind: 'poem', length: '2 min read',
    excerpt: 'Puddles keep the sky a little longer than the sky knows how to stay.',
    body: `Puddles keep the sky
a little longer
than the sky knows how to stay.

The pavement shines
with borrowed color.
Even the tired trees
have begun again—
quietly, without asking
to be noticed.`,
  },
  {
    id: 'postcard-home', title: 'Postcard Home', author: 'Lena Vale', mood: 'Nostalgia', kind: 'poem', length: '3 min read',
    excerpt: 'I kept the evening in my pocket, folded twice, for the train ride home.',
    body: `I kept the evening
in my pocket,
folded twice,
for the train ride home.

The river was a ribbon.
The houses were lit
like promises.

I did not know
that missing a place
could feel so much
like loving it.`,
  },
  {
    id: 'night-bloom', title: 'Night Bloom', author: 'Ari Santos', mood: 'Wonder', kind: 'poem', length: '2 min read',
    excerpt: 'Some things only open when the world has stopped looking for them.',
    body: `Some things only open
when the world has stopped
looking for them.

A flower in the dark.
A door left unlatched.
Your hand, finding mine
without the light.

The night is not empty.
It is making room.`,
  },
  {
    id: 'under-the-same-moon', title: 'Under the Same Moon', author: 'The Lanterns', mood: 'Warmth', kind: 'song', length: '3:42',
    excerpt: 'A little melody for the nights when distance feels softer than usual.',
    body: `A little melody
for the nights
when distance feels softer.

The same moon,
the same quiet,
and your name in the room.`,
  },
  {
    id: 'slow-dancing-in-the-kitchen', title: 'Slow Dancing in the Kitchen', author: 'June & August', mood: 'Devotion', kind: 'song', length: '4:08',
    excerpt: 'For ordinary rooms that become our favorite places by staying together.',
    body: `For ordinary rooms
that become our favorite places.

No music necessary,
just your hand in mine
and the evening taking its time.`,
  },
  {
    id: 'wish-you-were-here', title: 'Wish You Were Here', author: 'Mira Sol', mood: 'Hope', kind: 'poem', length: '2 min read',
    excerpt: 'Every small light in the city knows a little something about wanting.',
    body: `Every small light in the city
knows a little something
about wanting.

I leave one on for you,
in case the dark
needs a direction home.`,
  },
];

export const moods = ['All feelings', 'Longing', 'Stillness', 'Tenderness', 'Renewal', 'Nostalgia', 'Wonder'];
