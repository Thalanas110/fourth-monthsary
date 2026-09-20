import aisleSong from '@/assets/audios/I Saw You at the End of the Aisle.mp3';

export type Song = {
    id: string;
    title: string;
    author: string;
    duration: number;
    length: string;
    excerpt: string;
    body: string;
    audioSrc?: string;
};

export const songs: Song[] = [{
    id: 'i-saw-you-at-the-end-of-the-aisle',
    title: 'I Saw You at the End of the Aisle',
    author: 'Adriaan M. Dimate',
    duration: 0,
    length: 'Local audio',
    excerpt: 'A song waiting behind the lantern.',
    body: `Verse 1

The room was quieter than I imagined,
Morning pouring through the glass.
My hands were shaking at the altar,
While ten long years went rushing past.

I thought about the nights we waited,
Every mile we couldn't cross,
Every time we held on tighter
When we were terrified of loss.

Pre-Chorus

Then everybody slowly faded,
Every sound became so small.
Because somewhere beyond the doorway,
There you were-

And that was all.

Chorus

And you walked down the aisle toward me,
And I forgot how to breathe.
There were tears already falling
Before you ever reached me.

And after all those years of waiting,
You took my trembling hand in yours.
I whispered, "Madame, we made it."
Like I'd waited my whole life for those words.

Verse 2

I saw the years inside your eyes then,
Not the numbers-just the days.
All the laughter we'd collected,
All the storms that couldn't stay.

I remembered being younger,
Making promises through a screen,
Talking about some distant future
We were far too young to see.

Pre-Chorus 2

But suddenly that distant future
Was standing inches from my face.
And every road we'd ever taken
Had somehow led us to this place.

Chorus 2

And you stood at the altar with me,
While I struggled just to speak.
You were laughing through your crying;
I was crying through my cheeks.

And when they asked me for my answer,
There was nothing left to prove.
I'd been answering for years already
Every time I chose to love you.

Bridge

I don't remember all the flowers.
I don't remember what they played.
I don't remember who was watching,
Or every promise that we made.

But I remember how you looked at me
Like we'd finally reached the shore.
And I remember thinking quietly:

"I don't have to miss you anymore."

Final Chorus

So we walked from the aisle together,
Your fingers woven into mine.
And all those years that stood between us
Were finally left behind.

You leaned your head against my shoulder.
I kissed your forehead like before.
And whispered, "Welcome home, my Madame."

"We don't have to wait anymore."

Outro

Then morning came through my window.

And there was no aisle.

No flowers.

No ring upon your hand.

Just my room,
my piano,
and your name still sitting softly
inside my heart.

For a moment,
I almost cried
because it wasn't real.

But maybe dreams aren't always there
to show us things we've lost.

Maybe sometimes
they show us where we're going.

So I'll get up.

I'll finish growing.

You'll chase the life that's waiting for you.

And we'll take all the time we need
to become the people
who can finally live that morning.`,
    audioSrc: aisleSong,
}, {
    id: 'if-you-could-see-what-i-see',
    title: 'If You Could See What I See',
    author: 'Adriaan M. Dimate',
    duration: 0,
    length: 'Lyrics only',
    excerpt: 'A song about lending kinder eyes to the person you love.',
    body: `Verse 1

Sometimes I wonder what you see
when you're alone before the mirror.
Do you count the things you wish would change,
until the good becomes much harder to remember?

Because that's never where my eyes begin.
I see your laugh, your sleepy replies,
the random stories nobody would remember,
and the dreams still growing behind your eyes.

Pre-Chorus

If I could lend you my eyes
for just one night,
maybe you'd finally understand
why I hold you so close inside.

Chorus

If you could see what I see, Madame,
you'd see someone worth waiting for,
the girl whose smallest little message
can make me smile once more.

You'd see the one I miss and worry for,
the one I dream of holding too.
I never needed you to be perfect-
I fell in love with you.

Verse 2

We've had days that lasted forever,
and nights that asked too much of us.
We've known the ache of being distant,
and learned how difficult it is to trust

that morning always follows darkness,
that silence doesn't erase what's true.
And somehow through these three short months,
my heart kept finding home in you.

Bridge

Someday we'll find these old conversations
and laugh at how young we used to be.
We'll remember how badly we wanted
the future we couldn't yet see.

And maybe I'll look beside me
and find that future looking back-

the same eyes I fell for years ago,
still smiling back at me.

Final Chorus

If you could see what I see, Madame,
you'd see how precious you've become.
Through every laugh, every difficult day,
every distance we've overcome.

And years from now, if we're together,
with silver beginning to show,
I'll still see the girl behind that screen
I couldn't bear to let go.

Outro

So when you look into the mirror
and only see the things you'd change,
I wish that for five little minutes
I could lend my eyes your way.

Because then you'd finally meet
the girl I've been falling in love with.

And maybe, Madame-

you'd love her too.`,
}];
