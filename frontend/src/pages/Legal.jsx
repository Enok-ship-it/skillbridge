import { Link } from 'react-router-dom'

const LegalLayout = ({ eyebrow, title, updated, children }) => (
  <section className="legal-page container-x">
    <div className="legal-hero">
      <span className="section-label">{eyebrow}</span>
      <h1>{title}</h1>
      <p>Last updated: {updated}</p>
    </div>
    <article className="legal-card">
      {children}
    </article>
    <p className="legal-return"><Link to="/">Return to SkillBridge</Link></p>
  </section>
)

export const Terms = () => (
  <LegalLayout eyebrow="Legal" title="Terms of use" updated="22 September 2026">
    <h2>1. What SkillBridge is</h2>
    <p>SkillBridge is a peer-learning platform that helps college students discover and propose skill exchanges. It is an educational project and not a marketplace, employment service, certification body, or emergency service.</p>
    <h2>2. Your account</h2>
    <p>Provide accurate information, keep your credentials private, and use your own account. You must be eligible to use the service under your institution’s rules and local law.</p>
    <h2>3. Respectful exchanges</h2>
    <p>Only offer skills you can teach responsibly. Agree on the scope, timing, and format of every session before meeting. Never use the platform to request payment, share answers for assessed work, harass others, or post unlawful content.</p>
    <h2>4. Safety</h2>
    <p>Use campus-approved or public meeting spaces where possible. Trust your judgment and stop an interaction that feels unsafe. SkillBridge does not verify every user or guarantee outcomes from any exchange.</p>
    <h2>5. Service changes</h2>
    <p>We may improve, pause, or remove parts of this academic project as it evolves. Continued use after an updated notice means you accept the revised terms.</p>
  </LegalLayout>
)

export const Privacy = () => (
  <LegalLayout eyebrow="Privacy" title="Privacy notice" updated="22 September 2026">
    <h2>Information we store</h2>
    <p>We store the information needed to operate your account: name, email address, college profile, skills, biography, avatar URL, and exchange requests. Passwords are stored as cryptographic hashes, not readable text.</p>
    <h2>How information is used</h2>
    <p>Your profile information is used to show relevant learners and make exchanges possible. Other students can see the profile details you choose to publish in the platform.</p>
    <h2>What we do not do</h2>
    <p>SkillBridge does not sell student data or use profile data for advertising. As a college project, data handling may be reviewed by the project team for maintenance and demonstrations.</p>
    <h2>Your choices</h2>
    <p>You can edit your profile and skills at any time. For account deletion or a data request, contact the project team through your college’s approved channel. Do not put sensitive personal information in your bio or exchange messages.</p>
  </LegalLayout>
)

export const CommunityGuidelines = () => (
  <LegalLayout eyebrow="Community" title="Community guidelines" updated="22 September 2026">
    <h2>Be constructive</h2>
    <p>Show up prepared, communicate clearly, and respect a learner’s pace. Share credit for collaborative work and give feedback that is specific and kind.</p>
    <h2>Keep it safe and fair</h2>
    <p>No harassment, discrimination, intimidation, plagiarism, impersonation, fraud, spam, or requests for money. Do not pressure anyone to share contact details or meet outside a setting they are comfortable with.</p>
    <h2>Protect academic integrity</h2>
    <p>Teach concepts and methods; do not complete graded work for someone else or exchange exam material. The point of SkillBridge is real learning, not shortcuts.</p>
    <h2>Report and disengage</h2>
    <p>If an interaction is inappropriate, decline or end it. Save relevant details and report the issue through your college’s appropriate support process. In an emergency, contact local emergency services or campus security.</p>
  </LegalLayout>
)
