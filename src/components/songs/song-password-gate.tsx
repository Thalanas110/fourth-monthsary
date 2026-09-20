import { useState } from 'react';

export interface SongPasswordGateProps {
  error?: string;
  onSubmit: (candidate: string) => void;
}

export function SongPasswordGate({ error, onSubmit }: SongPasswordGateProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(password.trim());
    setPassword('');
  };

  return (
    <section className="song-password-panel" data-testid="song-password-gate">
      <div className="eyebrow">A question for the lantern keeper</div>
      <h1 className="song-password-title">When is our monthsary?</h1>
      <p className="song-password-copy">Answer correctly to open the songs.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="monthsary-password">Your answer</label>
        <input
          aria-describedby={error ? 'monthsary-password-error' : undefined}
          autoComplete="off"
          id="monthsary-password"
          name="monthsary-password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
        {error && <p aria-live="polite" className="song-password-error" id="monthsary-password-error" role="alert">{error}</p>}
        <button type="submit">Open the songs</button>
      </form>
    </section>
  );
}
