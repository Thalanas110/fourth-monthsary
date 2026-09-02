export default function NotFound() {
  return (
    <main className="app-shell" aria-labelledby="not-found-title">
      <div className="page-content">
        <section className="ritual">
          <div className="ritual-inner">
            <h1 className="ritual-quote" id="not-found-title">This door<br /><span>is quiet.</span></h1>
            <p className="hero-description">The page you were looking for is not part of this little library.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
