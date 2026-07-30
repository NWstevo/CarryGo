import { LegalDocument, Section } from "./LegalDocument";

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updated="July 2026">
      <Section title="1. What this policy covers">
        <p>
          This policy describes what CarryGo actually collects and does with your data today,
          based on how the platform currently works. As features change — particularly
          payments, which do not exist yet — this policy will be updated to match.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p><strong>Account information:</strong> your full name, email address, and a hashed
          (not plaintext) password.</p>
        <p><strong>Identity verification status:</strong> whether you're verified, and a
          reference ID from our verification provider. We do not store your identity documents
          ourselves — document and liveness checks are performed by a third-party verification
          provider, who holds that data under their own privacy practices.</p>
        <p><strong>Listings:</strong> trip details (route, date, available space) or request
          details (route, date, item, weight, budget) that you choose to post.</p>
        <p><strong>Item declarations:</strong> when you express interest in a listing, the item
          category, declared value, and origin country you submit.</p>
        <p><strong>Messages and media:</strong> chat messages, and any photos or videos you
          upload as verification evidence, are stored so both participants in a conversation
          can access them. Only the two people in a given chat can retrieve its messages or
          files.</p>
        <p><strong>Trust & safety records:</strong> we keep an append-only log of actions like
          creating, accepting, or cancelling a connection, and creating or updating a delivery,
          including your IP address and browser user-agent at the time of the action. This log
          cannot be edited or deleted and exists to investigate disputes, abuse, and prohibited-
          item attempts.</p>
        <p><strong>Ratings:</strong> scores and comments you leave for another user after a
          completed delivery.</p>
      </Section>

      <Section title="3. What we don't currently collect">
        <p>
          CarryGo does not use tracking or advertising cookies, and does not currently collect
          or process any payment information — no card numbers, bank details, or payment
          history — because no payment system has been built yet. Your session is kept in your
          browser's local storage, not a cookie.
        </p>
      </Section>

      <Section title="4. How we use your information">
        <ul className="list-disc space-y-2 pl-5">
          <li>To create and secure your account, and confirm you're a verified user before you
            can create or accept a listing.</li>
          <li>To show your listings to other users, and connect you with the other party in an
            accepted connection.</li>
          <li>To enforce the prohibited-items policy, both when you declare an item and again
            when a connection is accepted.</li>
          <li>To let the two participants in a chat communicate and exchange verification
            media privately.</li>
          <li>To investigate disputes, suspected fraud, or misuse, using the trust & safety
            log described above.</li>
          <li>To show other users your rating history.</li>
        </ul>
      </Section>

      <Section title="5. Who we share information with">
        <p>
          Chat messages, files, and connection details are visible only to the two people in
          that connection — not to other users. We share identity information with our
          identity verification provider solely to perform verification. We may disclose
          information if legally required to do so — for example, in response to a customs or
          law enforcement request. We do not sell your information to third parties.
        </p>
      </Section>

      <Section title="6. Retention and deletion">
        <p>
          We do not yet have an automated retention schedule or a self-serve way to export or
          delete your data — this is a known gap we intend to close. Until then, you can
          request access to or deletion of your data by contacting{" "}
          <strong>[Contact Email]</strong>, and we'll handle it manually. Trust & safety log
          entries are retained even after a related account or listing is removed, since they
          may be needed to investigate past disputes.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          Passwords are hashed, not stored in plaintext. Access to your account uses a signed
          token that expires after 7 days. Access to uploaded chat files is restricted to the
          two participants in that chat. As with any platform, no method of storage or
          transmission is perfectly secure, and we can't guarantee absolute security.
        </p>
      </Section>

      <Section title="8. International users">
        <p>
          CarryGo may be used by people in different countries, and the party you're matched
          with may be in a different country than you. Data may be processed in a country
          other than your own. If you're in the EU/EEA or UK, additional rights and transfer
          safeguards apply, and we intend to formalize these before serving users there at
          scale — see <strong>[Company Legal Name]</strong>'s compliance roadmap for details.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We'll update this policy as CarryGo's features change, especially once payments,
          insurance, or new verification steps are introduced. Material changes will be
          reflected by updating the date at the top of this page.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about this policy or your data can be sent to{" "}
          <strong>[Contact Email]</strong>.
        </p>
      </Section>
    </LegalDocument>
  );
}
