
import { TokenizationState } from "../../types";

export type RoadmapStatus = 'READY' | 'PENDING' | 'CONDITIONAL' | 'LOCKED';

export interface RoadmapStep {
    id: number;
    title: string;
    status: RoadmapStatus;
    badgeText: string;
    description: string;
    details: {
        label: string;
        content: string[];
    }[];
    output: string;
    upsell?: boolean;
}

export const GET_ROADMAP_DATA = (data: TokenizationState): RoadmapStep[] => {
    const country = data.jurisdiction.country;
    const isUS = country === 'US' || country.startsWith('US');
    const isEU = ['IT', 'FR', 'DE', 'EE', 'MT', 'EU'].includes(country);
    
    // Logic for Step 4 (Filing)
    let filingDetails: string[] = [];
    if (isUS) filingDetails = ["Reg D (506b/506c) - Form D Filing", "Reg S (International Investors)"];
    else if (isEU) filingDetails = ["MiCA Compliance Statement", "Local Prospectus Notification"];
    else filingDetails = ["Offering Memo + Registry Notification", "Local AML Registration"];

    return [
        {
            id: 1,
            title: "SPV Formation Setup",
            status: "READY",
            badgeText: "Ready (Simulated)",
            description: "The legal foundation. Establishing the bankruptcy-remote entity to hold the asset.",
            details: [
                {
                    label: "Recommended Structure",
                    content: isUS 
                        ? ["Delaware LLC", "Operating Agreement with Token Rights"] 
                        : isEU 
                            ? [`${data.jurisdiction.spvType || 'Local SPV'} (EU Compliant)`, "Notarial Deed (if required)"]
                            : ["IBC / Exempted Company", "Nominee Director Setup"]
                }
            ],
            output: "Basic Corporate Pack (Simulated) • Ownership Mapping"
        },
        {
            id: 2,
            title: "Token Legal Framework",
            status: "READY",
            badgeText: "Ready (Simulated)",
            description: "Defining the digital rights and restrictions embedded in the smart contract.",
            details: [
                {
                    label: "Selected Model: ERC-3643",
                    content: [
                        "Mandatory On-chain KYC",
                        "Dynamic Whitelist Management",
                        `Aligned with ${data.compliance.regFramework}`
                    ]
                }
            ],
            output: "Token Classification Snapshot • Compliance Ruleset"
        },
        {
            id: 3,
            title: "KYC/AML Compliance",
            status: "PENDING",
            badgeText: "Unlock in PRO",
            description: "Identity verification infrastructure for investor onboarding.",
            details: [
                {
                    label: "Required Capabilities",
                    content: [
                        "Identity Verification (Level 1-3)",
                        "PEP & Sanctions Screening",
                        isUS ? "Accreditation Check (Rule 506c)" : "Liveness Check"
                    ]
                }
            ],
            output: "Investor Onboarding Engine • Compliance Dashboard",
            upsell: true
        },
        {
            id: 4,
            title: "Offering Filing Requirements",
            status: "PENDING",
            badgeText: "PRO / Enterprise",
            description: "Regulatory notifications required before accepting capital.",
            details: [
                {
                    label: `Jurisdiction: ${country}`,
                    content: filingDetails
                }
            ],
            output: "Filing Checklist (Simulated) • Legal Opinion Template",
            upsell: true
        },
        {
            id: 5,
            title: "Smart Contract Deployment",
            status: "LOCKED",
            badgeText: "Locked (PRO)",
            description: "Minting the T-REX security token suite on Mainnet or L2.",
            details: [
                {
                    label: "Technical Ops",
                    content: [
                        "Deploy ERC-3643 Identity Registry",
                        "Configure Compliance Modules",
                        "Initialize On-chain Cap Table"
                    ]
                }
            ],
            output: "Smart Contract Address • Admin Keys",
            upsell: true
        },
        {
            id: 6,
            title: "Custody Setup",
            status: "LOCKED",
            badgeText: "Locked (PRO)",
            description: "Institutional-grade storage for digital assets and treasury.",
            details: [
                {
                    label: "Infrastructure",
                    content: [
                        "Qualified Custodian Vault",
                        "Asset Segregation",
                        "Automated Dividend Distribution"
                    ]
                }
            ],
            output: "Custody Agreement • Wallet Architecture",
            upsell: true
        },
        {
            id: 7,
            title: "Marketplace Eligibility",
            status: "CONDITIONAL",
            badgeText: "Partially Ready",
            description: "Readiness check for secondary market listing.",
            details: [
                {
                    label: "Requirements Checklist",
                    content: [
                        "SPV Valid: ✅",
                        "Token Standard: ✅",
                        "KYC Active: ❌ (Pending)",
                        "Listing Agreement: ❌ (Pending)"
                    ]
                }
            ],
            output: "4/7 Requirements Met"
        },
        {
            id: 8,
            title: "Go-Live Authorization",
            status: "LOCKED",
            badgeText: "Enterprise Only",
            description: "Final green light for public launch and capital collection.",
            details: [
                {
                    label: "Final Gates",
                    content: [
                        "Smart Contract Audit",
                        "Legal Opinion Letter",
                        "Marketplace Publishing"
                    ]
                }
            ],
            output: "Launchpad Activation",
            upsell: true
        }
    ];
};
