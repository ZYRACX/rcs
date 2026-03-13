import './HomePage.css';
import { Link } from 'react-router-dom';
export default function HomePage() {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <h1 className="logo">RCS</h1>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#play" className="play-btn">Play Now</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>
            Build Your <span className="highlight">Country</span>
          </h2>
          <p>
            Start small, dream big. In Tycoon Empire, every decision counts.
            Will you rise to become the ultimate magnate?
          </p>
          <Link to="/auth/register" className="cta">Start Playing</Link>
        </div>
        {/* <div className="hero-image">
          <img src="/tycoon-hero.png" alt="Tycoon gameplay art" />
        </div> */}
      </section>

      {/* Features */}
      <section id="features" className="features">
        <h3>Game Features</h3>
        <div className="features-grid">
          <div className="feature">
            <h4>Dynamic Economy</h4>
            <p>Trade, invest, and expand in a living world where the market shifts with your actions.</p>
          </div>
          <div className="feature">
            <h4>Build & Customize</h4>
            <p>Design your empire your way — from humble shops to skyscrapers that define the skyline.</p>
          </div>
          <div className="feature">
            <h4>Compete & Collaborate</h4>
            <p>Team up with friends or outsmart rivals as you climb the global leaderboard.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about">
        <h3>About Tycoon Empire</h3>
        <p>
          Tycoon Empire is a strategy simulation game where every choice shapes
          your legacy. Whether you’re running factories, real estate, or
          high-tech startups, you’ll need sharp instincts and a long-term vision
          to dominate the market.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Tycoon Empire. All rights reserved.
      </footer>
    </div>
  );
}
