import { DuckBulletPoint } from "../components/duck-bullet-point";

export function ReferralPage() {
  return (
    <div className="duckPageContainer">
      <div className="duckLogo">👨‍👩‍👧‍👦</div>
      <div className="duckTitle">Invite frens. Earn points</div>
      <div className="duckChain duckSubtitle">
        <div className="duckChainElement">
          <DuckBulletPoint />
          <div className="content-container">
            <div className="content-title">Share your invitation link</div>
            <div className="content-subtitle">
              Spread the crypto among friends
            </div>
          </div>
        </div>
        <div className="duckChainElement">
          <DuckBulletPoint />
          <div className="content-container">
            <div className="content-title">Your friends join Duck</div>
            <div className="content-subtitle">And start farming points</div>
          </div>
        </div>
        <div className="duckChainElement">
          <DuckBulletPoint />
          <div className="content-container">
            <div className="content-title">
              Earn 10% of the BP farmed by frens
            </div>
            <div className="content-subtitle">
              Plus an extra 2.5% from their referrals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
