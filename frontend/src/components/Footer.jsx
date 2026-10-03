import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="site-footer">
    <div className="container-x">
      <div className="footer-grid">

        <div className="footer-brand">
          <div className="footer-brand-title">
            <span className="brand-mark" aria-hidden="true"><span className="brand-mark-bolt">↯</span></span>
            <span className="footer-brand-word">SkillBridge</span>
          </div>
          <p>
            A safer way for college students to exchange practical knowledge, build confidence, and learn together.
          </p>
          <div className="footer-stack" aria-label="Technology stack">
            <span>Peer learning</span><span>Open exchange</span><span>Student built</span>
          </div>
        </div>

        <div>
          <h2>Platform</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Find learners</Link></li>
            <li><Link to="/register">Create an account</Link></li>
            <li><Link to="/login">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h2>Trust &amp; policies</h2>
          <ul>
            <li><Link to="/community-guidelines">Community guidelines</Link></li>
            <li><Link to="/privacy">Privacy notice</Link></li>
            <li><Link to="/terms">Terms of use</Link></li>
            <li><span>Educational project</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SkillBridge. Learn by teaching, grow by sharing.</p>
        <p>Final-year project · Built for peer learning</p>
      </div>
    </div>
  </footer>
)

export default Footer
