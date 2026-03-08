import React from "react";

const Card = ({
  setOpenAllICO,
  setOpenTokenCreator,
  setOpenTransferToken,
  setOpenTokenHistory,
  setOpenICOMarketplace,
  copyAddress,
  setOpenCreateICO,
  setOpenWithdrawToken,
}) => {
  const features = [
    {
      title: "ICO ADDRESS",
      icon: "🏷️",
      description:
        "Copy the ICO contract address to transfer tokens or share with collaborators.",
      btnName: "Copy Address",
      action: () => copyAddress(),
    },
    {
      title: "Create ICO",
      icon: "🛠️",
      description:
        "Launch a new ICO by specifying token address and price to list it on the marketplace.",
      btnName: "Create ICO",
      action: () => setOpenCreateICO(true),
    },
    {
      title: "Your Created ICO",
      icon: "📦",
      description:
        "View and manage the ICOs you've created — check status and token balances.",
      btnName: "My ICOs",
      action: () => setOpenAllICO(true),
    },
    {
      title: "ICO Marketplace",
      icon: "🛒",
      description:
        "Explore listed ICOs, discover new tokens and participate in presales.",
      btnName: "Explore",
      action: () => setOpenICOMarketplace(true),
    },
    {
      title: "Create Token",
      icon: "🧾",
      description:
        "Quickly create an ERC-20 token with a custom name, symbol and supply.",
      btnName: "Create Token",
      action: () => setOpenTokenCreator(true),
    },
    {
      title: "History",
      icon: "📜",
      description:
        "View your token creation and transaction history for audits and records.",
      btnName: "View History",
      action: () => setOpenTokenHistory(true),
    },
    {
      title: "Transfer Token",
      icon: "🔁",
      description:
        "Send tokens to another address using a simple transfer interface.",
      btnName: "Transfer",
      action: () => setOpenTransferToken(true),
    },
    {
      title: "Withdraw Token",
      icon: "💸",
      description:
        "Withdraw tokens from a sale back to your wallet when needed.",
      btnName: "Withdraw",
      action: () => setOpenWithdrawToken && setOpenWithdrawToken(true),
    },
  ];

  return (
    <div className="wrapper">
      {features.map((feature, index) => (
        <div key={index} className="card">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span className="card-icon" aria-hidden>{feature.icon}</span>
            <h3 className="card-title">{feature.title}</h3>
          </div>
          <p className="card-content" style={{marginTop:"0.8rem"}}>
            {feature.description}
          </p>
          <button
            className="card-btn"
            onClick={() => feature.action && feature.action()}
            aria-label={feature.btnName}
          >
            {feature.btnName}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Card;
