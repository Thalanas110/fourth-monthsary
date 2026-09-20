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
    id: 'if-i-could-be-there', 
    title: 'If I Could Be There', 
    author: 'Adriaan M. Dimate', 
    mood: 'Longing', 
    kind: 'poem', 
    length: '3 min read',
    excerpt: 'A thousand dreams may yet come true, but most of all—I just want you.',
    body: `Some nights I stare into the night,
And wonder if you're doing right;
I hope you're somewhere warm and sound,
Where peace and gentleness surround.

I wish these miles would fade away,
So I could reach you there today;
No screens or distance left between,
Just you and me where I can be seen.

I wish that I could hold your hand,
And safely by your side could stand;
To hear your voice so warm and clear,
And know you're safe whenever I'm near.

There are so many things I hide,
So many worries kept inside;
I'd rather give you peaceful days,
Than burden you with all my dismays.

But, Madame, when the stars appear bright,
My thoughts return to you each night;
I wonder if you're smiling too,
While every thought comes back to you.

I wish I could already hold you tight,
And keep you close throughout the night;
Your head upon my chest could stay,
While all our worries drift away.

I wish we'd have an afternoon free,
With nowhere else we're meant to be;
Just laughing underneath the sun,
Together having simple fun.

I want those moments, small and sweet,
The kind that make a life complete;
Your sleepy voice, your stories too,
And waking every day with you.

And someday distance will be gone,
And we'll no longer wait till dawn;
I'll treasure every laugh we share,
Because I'll finally have you there.

Until that day, when silence stays,
I'll keep my light through darkest days;
No matter when its glow you see,
That little light will always be me.

Because beneath each worried thought,
There lies the future I have sought;
I need no perfect skies of blue,
I only want a life with you.

So please be safe tonight, my dear,
Until the day I can be near;
A thousand dreams may yet come true,
But most of all—I just want you.`,
  },
  {
    id: 'the-waiting-days', 
    title: 'The Waiting Days', 
    author: 'Adriaan M. Dimate', 
    mood: 'Longing', 
    kind: 'poem', 
    length: '4 min read',
    excerpt: 'One little light will always stay, still waiting for you—come what may.',
    body: `There came a night devoid of light,
I searched for you with all my might,
I told myself you'd be all right,
Yet still I worried through the night.

Each morning brought another day,
I hoped somehow you'd find a way,
And though I had so much to say,
I kept my faith and chose to stay.

I never knew how silence grew,
Until the world went still with you,
Yet every promise I once knew,
Became the thread that pulled me through.

I kept the words I couldn't send,
Believing silence had an end,
And even if the years should bend,
I'd wait for you, my love, my friend.

I thought about your precious smile,
The one that makes each day worthwhile,
And wished that I could cross each mile,
To sit beside you for a while.

I dreamed of holding you so near,
And whispering softly, "I'm right here,"
To wipe away each falling tear,
And make the whole wide world disappear.

I wished your head were on my chest,
Where for a while your heart could rest,
I'd hold you close and do my best,
To make you feel forever blessed.

And if the seasons came and went,
If every year were somehow spent,
My heart would know what waiting meant,
For loving you was my intent.

What hurt was not the passing years,
Nor lonely nights or hidden tears,
But all the dreams beneath my fears,
That might have vanished through the years.

The mornings we had yet to see,
The places where we'd someday be,
The simple life of you and me,
The future where our hearts were free.

Then from the silence came your voice,
And suddenly my heart rejoiced,
Of every gift I could have choice,
I'd choose you still with one clear voice.

So should the world grow dark someday,
And once again you're far away,
One little light will always stay,
Still waiting for you—come what may.`,
  },
  {
    id: 'everything-i-miss-about-you', 
    title: 'Everything I Miss About You', 
    author: 'Adriaan M. Dimate', 
    mood: 'Longing', 
    kind: 'poem', 
    length: '3 min read',
    excerpt: "It's not one thing I miss of you—I miss my Madame. All of you.",
    body: `I miss your voice when ends the day,
I miss the little things you say,
I miss you more than words convey,
And wish these miles would melt away.

I miss the laughter that you bring,
The joy you somehow give each thing,
The way one message makes me sing,
Like suddenly the world found spring.

I miss your smile, so warm and bright,
The one that makes my burdens light,
The one I'd gladly cross each night,
Just for the chance to see that sight.

I miss the stories that you share,
The little moments here and there,
The thought of running through your hair,
While quietly holding you with care.

I miss your sleepy, gentle tone,
The one I wish I'd always known,
Because whenever I'm alone,
I wish your voice could reach my phone.

I miss the way you make me smile,
Even separated by each mile,
I'd walk them all in single file,
If you were waiting at the final aisle.

I miss the things we've yet to do,
The places I would go with you,
The skies we'd watch turn gold to blue,
And ordinary mornings too.

I miss the hugs we've yet to make,
The quiet walks we'd someday take,
The little memories we would make,
And every sunrise we'd awake.

I miss the future we could see,
The simple thought of you and me,
No grander place I'd rather be,
Than somewhere we can simply be.

I miss you when the stars appear above,
I miss you with a quiet kind of love,
The kind no distance could dispose of,
As constant as the endless skies above.

And maybe someday you'll be near,
No screen between us, crystal clear,
I'll finally whisper in your ear,
"I missed you more than you could hear."

So when you ask what I miss too,
The answer's simple, deep, and true:
It's not one thing I miss of you—
I miss my Madame. All of you.`,
  },
  {
    id: 'if-i-could-live-these-three-months-again', 
    title: 'If I Could Live These Three Months Again', 
    author: 'Adriaan M. Dimate', 
    mood: 'Nostalgia', 
    kind: 'poem', 
    length: '3 min read',
    excerpt: "I'd still find you. I'd still love you. I'd still choose you.",
    body: `If I could turn the hands of time,
I'd find the days when you became mine,
I'd watch our little stars align,
And fall for you again each time.

I'd read our oldest words once more,
Remember what we waited for,
Before we knew what lay in store,
Or how much love we'd come to store.

I'd keep the nights we laughed away,
The silly things we'd always say,
Those little moments from each day,
That somehow never fade away.

I'd keep each time you called me dear,
Each moment when you felt so near,
Each tiny memory from this year,
I'd hold them all forever here.

But I would keep the harder days,
The ones that tested us in ways
We never thought we'd have to face,
Yet somehow love still found its place.

I'd keep the moments I felt blue,
Because they showed what I already knew:
However difficult life grew,
My heart kept finding home in you.

There were some nights I couldn't sleep,
Because the things I loved ran deep,
And promises I chose to keep
Were worth the nights that made me weep.

There were some days when all I'd do
Was quietly hope I'd hear from you,
And when one little message came through,
My whole world somehow breathed anew.

And maybe that's what makes me cry,
How quickly all these months went by,
How much we've carried, you and I,
Yet neither heart has said goodbye.

One day these months will feel so small,
Old photographs upon a wall,
Yet I'll remember through it all,
How we kept standing after each fall.

And if someday you ask me when
I'd choose to start our story again,
I'd take the joy, the fear, the pain,
And walk those three whole months again.

Because if time returned me to
The day before I first found you,
Knowing everything we'd travel through—
I'd still find you. I'd still love you. I'd still choose you.`,
  },
  {
    id: 'when-i-finally-get-to-hold-you', 
    title: 'When I Finally Get to Hold You', 
    author: 'Adriaan M. Dimate', 
    mood: 'Longing', 
    kind: 'poem', 
    length: '3 min read',
    excerpt: "Madame… I'm finally holding you at last.",
    body: `I've dreamed about that coming day,
When distance finally fades away,
When I don't need a screen to say,
"I love you, Madame—please just stay."

I'll finally see those eyes so bright,
No photograph, no screen, no light,
Just you before my very sight,
And everything will feel so right.

I wonder what I'll even do,
The moment I am there with you,
Perhaps I'll cry before I knew,
How much these months had put me through.

And when I finally hold you near,
I'll carry every silent tear,
Each time I wished that you were here,
Each night I whispered, "Please be near."

You'll feel my arms around you tight,
But you won't see each waiting night,
Each time your name became my light,
When everything did not feel right.

You'll think it's just a warm embrace,
My arms around your gentle face,
But I'll be holding every trace,
Of all the months we couldn't replace.

I'll hold the laughs we used to share,
The little jokes from here and there,
The countless times I wished your hair
Were underneath my fingers there.

I'll hold each message that came through,
Each little "I love you" from you,
Each dream we somehow slowly grew,
And every storm we wandered through.

Perhaps I'll say no words at all,
Perhaps I'll simply let them fall,
The tears I've carried through it all,
While finally hearing your heart call.

And maybe you'll just laugh at me,
And ask why I'm as weak as can be,
But, Madame, then perhaps you'll see,
What holding you would mean to me.

For you may think I'm holding you,
But I'll hold everything we've been through,
Three months of dreams and waiting too,
And every future I dream with you.

So when that day arrives at last,
I'll hold you close and breathe out fast,
And whisper while remembering our past:
"Madame… I'm finally holding you at last."`,
  },
  {
    id: 'you-became-my-home', 
    title: 'You Became My Home', 
    author: 'Adriaan M. Dimate', 
    mood: 'Tenderness', 
    kind: 'poem', 
    length: '3 min read',
    excerpt: 'I found my home the day I found you, Madame.',
    body: `I used to think that home was a place,
Four quiet walls, a familiar space,
A door I'd open, a room I'd embrace,
Until I found home within your grace.

It happened slowly, day by day,
Inside the little things you'd say,
The laughs and jokes we'd throw away,
Until they somehow learned to stay.

Your voice became a gentle sound,
That made the noisy world calm down,
And when my thoughts would spin around,
Your presence brought me safer ground.

Your messages became my light,
A little warmth throughout the night,
One simple word could make things bright,
And somehow everything felt right.

It wasn't something that I planned,
Or something I could understand,
But slowly, when you held my hand,
My heart discovered where to land.

I learned your laughter, soft and sweet,
The little things that made you complete,
The way my heart would skip a beat,
Whenever somehow our worlds would meet.

And even when you're far away,
Some part of you still seems to stay,
Inside the memories of each day,
And all the silly things we'd say.

We've seen some skies turn cold and gray,
We've watched some easy roads give way,
Yet somehow after every day,
My heart still wandered back your way.

And someday when I'm by your side,
With nowhere left our hearts must hide,
I'll look at everything we've tried,
And smile because we made the ride.

I don't need castles reaching high,
Or perfect stars across the sky,
Just mornings waking by your side,
And evenings knowing you're nearby.

Because a home is more than stone,
More than a place that you can own,
It's where your heart is fully known,
And where you never feel alone.

I spent my life believing home
Was somewhere in this world I'd roam,
Then somehow, without even knowing—
I found my home the day I found you, Madame.`,
  },
  {
    id: 'the-weight-we-carried-together', 
    title: 'The Weight We Carried Together', 
    author: 'Adriaan M. Dimate', 
    mood: 'Renewal', 
    kind: 'poem', 
    length: '3 min read',
    excerpt: "We found our strength through all of this—and through it all, I'd still choose us like this.",
    body: `We never walked an easy road,
We each were given our own load,
Yet when the weight began to grow,
We shared the strength we came to know.

There were some days we both felt tired,
When even hope itself expired,
Yet somehow hearts that once felt tired,
Found one more reason to be inspired.

Sometimes it hurt on your own side,
Sometimes it hurt on mine inside,
But neither had a need to hide,
For somehow we stood side by side.

We couldn't always make things right,
Or chase away each painful night,
But we could be each other's light,
And make the darkness feel less bright.

There were some tears you couldn't show,
And there were mine you'd never know,
Yet somehow love would always grow,
Through things we never had to show.

Some days your strength would carry me,
Some days I'd be your strength to be,
And when neither one of us felt free,
We'd dream about who we could be.

We learned that love is sometimes small,
A simple message, just a call,
A "Have you eaten?" through it all,
That somehow meant much more than all.

We learned that being strong could mean,
Just staying when the days turned mean,
Still finding laughter in between,
And guarding every little dream.

We couldn't carry every pain,
Or shelter one another from the rain,
But when the clouds returned again,
We knew we wouldn't walk in vain.

And maybe someday we'll look back,
At every road and every crack,
And wonder how we stayed on track,
When life kept pushing both hearts back.

I'll tell you then what I know now,
We didn't need to understand how,
We simply made one quiet vow:
"We'll keep on going, here and now."

So let the world remember this,
Not every love begins in bliss,
We found our strength through all of this—
And through it all, I'd still choose us like this.`,
  },
];

export const moods = ['All feelings', 'Longing', 'Stillness', 'Tenderness', 'Renewal', 'Nostalgia', 'Wonder'];
