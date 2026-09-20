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
    id: 'if-i-could-live-these-three-months-again', title: 'If I Could Live These Three Months Again', author: 'Adriaan M. Dimate', mood: 'Nostalgia', kind: 'poem', length: '3 min read',
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
];

export const moods = ['All feelings', 'Longing', 'Stillness', 'Tenderness', 'Renewal', 'Nostalgia', 'Wonder'];
