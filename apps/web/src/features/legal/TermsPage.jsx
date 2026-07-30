import { LegalDocument, Section } from "./LegalDocument";

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service" updated="July 2026">
      <Section title="1. What CarryGo is">
        <p>
          CarryGo is a platform that connects two kinds of users: <strong>Travelers</strong>,
          who have unused luggage space on an upcoming trip and list it as a "trip," and{" "}
          <strong>Senders</strong>, who want an item carried to a destination and either
          respond to a Traveler's trip or post their own "request" for a Traveler to respond
          to.
        </p>
        <p>
          CarryGo is an intermediary only. We provide the platform that lets Travelers and
          Senders find each other, agree on terms, and track a delivery from agreement to
          confirmation. <strong>
            CarryGo is not a shipping company, common carrier, freight forwarder, or customs
            broker
          </strong>, does not take possession of any item at any point, and is not a party to
          the arrangement a Traveler and Sender make with each other.
        </p>
      </Section>

      <Section title="2. Eligibility and identity verification">
        <p>
          You must be at least 18 years old to create an account. By creating an account, you
          confirm you meet this requirement — CarryGo does not currently perform independent
          age verification.
        </p>
        <p>
          Before you can create a trip or request, express interest in one, or accept an
          interested party's offer, you must complete identity verification. CarryGo does not
          store your identity documents itself; verification is performed by a third-party
          provider, and CarryGo retains only a verification status and reference ID.
        </p>
      </Section>

      <Section title="3. Listings, item declarations, and prohibited items">
        <p>
          Every time a Sender expresses interest in a trip, or a Traveler offers to carry a
          Sender's request, the initiating party must declare the item's category, its
          declared value, and its country of origin. This declaration is fixed once submitted
          and cannot be edited — if the details change, the interest must be withdrawn and
          resubmitted.
        </p>
        <p>
          CarryGo maintains a list of prohibited item categories that cannot be declared or
          carried through the platform under any circumstances, currently including: weapons,
          drugs and controlled substances, live animals, currency and bullion, and hazardous
          materials. This list may change at any time, and a previously-accepted category can
          be re-checked and blocked at the point of acceptance.
        </p>
        <p>
          <strong>
            You are solely responsible for knowing and complying with the customs, import/
            export, and aviation security laws of every country and airline involved in your
            trip or shipment.
          </strong>{" "}
          A category being allowed on CarryGo is not confirmation that an item is legal to
          carry on a specific route, airline, or border crossing. CarryGo's prohibited-items
          list is a platform safety floor, not legal or customs advice.
        </p>
      </Section>

      <Section title="4. Verification photos and videos">
        <p>
          Once a connection is accepted, a private chat opens between the Traveler and Sender.
          Within that chat, either party may be asked to (or may choose to) share photo or
          video evidence of the item at different stages — before handover, at handover, at
          delivery, or as evidence in a dispute. This exists to help both parties confirm
          what's actually being carried; it is not a guarantee against fraud, loss, or
          misdeclaration, and CarryGo does not inspect or verify this media itself.
        </p>
      </Section>

      <Section title="5. Accepting, declining, and forming a deal">
        <p>
          The receiving party in a connection (the Traveler for a trip-based interest, or the
          Sender for a request-based offer) may accept, decline, or take no action. The
          initiating party may cancel their own pending interest at any time before it's
          acted on.
        </p>
        <p>
          Once accepted, either party may finalize the arrangement into a tracked delivery. At
          that point the underlying trip or request listing is closed to further interest, and
          any other pending interest on the same listing is automatically declined. This is
          also the point at which the item declaration becomes binding for both parties.
        </p>
      </Section>

      <Section title="6. Delivery tracking and disputes">
        <p>
          A finalized delivery moves through defined stages: agreed, in transit, delivered,
          and completed. Only the Traveler can mark an item in transit or delivered; only the
          Sender can confirm completion. Either party may raise a dispute at most stages of
          this process instead of progressing it.
        </p>
        <p>
          CarryGo does not currently mediate disputes automatically or guarantee an outcome.
          Disputed deliveries are logged, and resolution currently depends on direct
          communication between the parties. Both parties may rate each other once a delivery
          is completed.
        </p>
      </Section>

      <Section title="7. Payment, loss, and liability">
        <p>
          <strong>
            CarryGo does not currently process, hold, or guarantee any payment between
            Travelers and Senders.
          </strong>{" "}
          Any compensation for carrying an item is arranged and settled directly between the
          two parties, entirely outside the platform, at their own risk.
        </p>
        <p>
          <strong>
            CarryGo does not currently provide insurance, escrow, or any guarantee against
            loss, damage, theft, customs seizure, or non-delivery of an item.
          </strong>{" "}
          Until such a system exists, Travelers and Senders bear this risk themselves and
          should not send or carry items whose loss they could not accept. CarryGo's role is
          limited to providing the matching, communication, and tracking tools described
          above.
        </p>
      </Section>

      <Section title="8. Account suspension and termination">
        <p>
          CarryGo may suspend or terminate an account for declaring or attempting to carry a
          prohibited item, for fraud or misrepresentation, for abusive conduct toward another
          user, or for other violations of these Terms.
        </p>
      </Section>

      <Section title="9. Changes to these Terms">
        <p>
          We may update these Terms as the platform changes — for example, if payment
          processing, insurance, or additional verification requirements are introduced.
          Material changes will be reflected by updating the date at the top of this page.
        </p>
      </Section>

      <Section title="10. Governing law and contact">
        <p>
          These Terms are governed by the laws of <strong>[Governing Jurisdiction]</strong>,
          without regard to conflict-of-law principles. CarryGo is operated by{" "}
          <strong>[Company Legal Name]</strong>. Questions about these Terms can be sent to{" "}
          <strong>[Contact Email]</strong>.
        </p>
      </Section>
    </LegalDocument>
  );
}
