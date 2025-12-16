
import { jsPDF } from "jspdf";
import { AcademyState } from "../types";

// Helper class for PDF generation to maintain state (cursor position) and styling
class PdfBuilder {
  doc: jsPDF;
  y: number;
  margin: number;
  pageHeight: number;
  pageWidth: number;
  contentWidth: number;

  constructor(title: string) {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.margin = 20;
    this.y = this.margin;
    this.contentWidth = this.pageWidth - (this.margin * 2);

    // Initial Setup
    this.addHeader(title);
  }

  addHeader(title: string) {
    this.doc.setFillColor(15, 23, 42); // Slate 900
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(22);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PropertyDEX Academy", this.margin, 20);
    
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(148, 163, 184); // Slate 400
    this.doc.text(title, this.margin, 30);

    this.y = 50;
  }

  checkPageBreak(heightNeeded: number) {
    if (this.y + heightNeeded > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.y = this.margin;
    }
  }

  addSectionTitle(title: string) {
    this.checkPageBreak(20);
    this.doc.setFontSize(16);
    this.doc.setTextColor(15, 23, 42); // Slate 900
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.y);
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(203, 213, 225); // Slate 300
    this.doc.line(this.margin, this.y + 2, this.pageWidth - this.margin, this.y + 2);
    this.y += 12;
  }

  addSubTitle(title: string) {
    this.checkPageBreak(15);
    this.doc.setFontSize(12);
    this.doc.setTextColor(71, 85, 105); // Slate 600
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.y);
    this.y += 8;
  }

  addParagraph(text: string, isBold: boolean = false, color: string = "#334155") {
    if (!text) return;
    this.doc.setFontSize(10);
    this.doc.setTextColor(color);
    this.doc.setFont("helvetica", isBold ? "bold" : "normal");
    
    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    this.checkPageBreak(lines.length * 5);
    
    this.doc.text(lines, this.margin, this.y);
    this.y += (lines.length * 5) + 3;
  }

  addKeyValue(key: string, value: any) {
    if (value === undefined || value === null || value === '') return;
    this.checkPageBreak(7);
    this.doc.setFontSize(10);
    
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 116, 139); // Slate 500
    this.doc.text(`${key}:`, this.margin, this.y);
    
    const keyWidth = this.doc.getTextWidth(`${key}:`);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(15, 23, 42); // Slate 900
    
    const textVal = String(value);
    // Handle multi-line values
    const lines = this.doc.splitTextToSize(textVal, this.contentWidth - keyWidth - 5);
    
    if (lines.length === 1) {
        this.doc.text(lines[0], this.margin + keyWidth + 5, this.y);
        this.y += 6;
    } else {
        this.doc.text(lines, this.margin + keyWidth + 5, this.y);
        this.y += (lines.length * 5) + 6;
    }
  }

  // Recursively prints objects
  printData(data: any, depth = 0) {
    if (!data) return;

    Object.entries(data).forEach(([key, value]) => {
      // Formatting keys
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/_/g, ' ');

      if (key === 'id' || key === 'uuid' || key === 'status') return; // Skip meta fields

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Nested Object -> Section
        if (depth === 0) this.addSectionTitle(label);
        else this.addSubTitle(label);
        this.printData(value, depth + 1);
      } 
      else if (Array.isArray(value)) {
        // List
        this.addSubTitle(label);
        value.forEach(item => {
           if (typeof item === 'string') {
               this.addParagraph(`• ${item}`);
           } else if (typeof item === 'object') {
               // Simple object in array
               const summary = Object.values(item).filter(v => typeof v !== 'object').join(', ');
               this.addParagraph(`• ${summary}`);
           }
        });
        this.y += 5;
      } 
      else {
        // Simple Value
        this.addKeyValue(label, value);
      }
    });
  }

  save(filename: string) {
    this.doc.save(filename);
  }
}

export const AcademyPdfService = {
  
  generateVisionStratPDF: (data: any) => { 
    const builder = new PdfBuilder("Vision & Strategy Blueprint");
    builder.printData(data);
    builder.save("Vision_Strategy.pdf");
  },

  generateMarketSnapshotPDF: (data: any) => { 
    const builder = new PdfBuilder("Market Analysis Snapshot");
    builder.printData(data);
    builder.save("Market_Snapshot.pdf");
  },

  generateFinancialModelPDF: (financeState: any, projectContext: any) => { 
    const builder = new PdfBuilder("Financial Model Report");
    // Flatten structure for better readability
    const report = {
        Project: projectContext?.projectInfo?.projectName || "Draft Project",
        ...financeState
    };
    builder.printData(report);
    builder.save("Financial_Model.pdf");
  },

  generateBlueprintPDF: (data: any) => {
    const builder = new PdfBuilder("Asset DNA Blueprint");
    builder.printData(data);
    builder.save("Asset_Blueprint.pdf");
  },

  generateSpvStrategicBlueprintPDF: (data: any) => {
    const builder = new PdfBuilder("Legal SPV Architecture");
    builder.printData(data);
    builder.save("SPV_Strategic_Blueprint.pdf");
  },

  generateFullAcademyPDF: (state: AcademyState) => {
    const builder = new PdfBuilder("Academy Transcript & Progress");
    
    builder.addSectionTitle("Progress Overview");
    builder.addKeyValue("Total Progress", `${state.meta.totalProgress}%`);
    builder.addKeyValue("Current Module", state.meta.currentModuleId);
    
    // Iterate modules
    Object.keys(state.modules).forEach(modKey => {
        builder.addSectionTitle(`Module: ${modKey}`);
        builder.addKeyValue("Completed", state.modules[modKey].completed ? "Yes" : "No");
        builder.addKeyValue("Last Updated", new Date(state.modules[modKey].lastUpdated).toLocaleDateString());
    });

    builder.save("Academy_Transcript.pdf");
  },

  generateLegalWrapperPDF: (data: any, aiNextSteps: any) => {
      const builder = new PdfBuilder("Legal Wrapper & Compliance Strategy");
      builder.printData({
          ...data,
          ExecutiveSummary: aiNextSteps
      });
      builder.save("Legal_Compliance_Blueprint.pdf");
  },

  generateTokenomicsBlueprintPDF: (data: any, aiContent: any) => {
      const builder = new PdfBuilder("Tokenomics Engineering Blueprint");
      
      if (aiContent) {
          builder.addSectionTitle("Executive Summary");
          builder.addParagraph(aiContent.executiveSummary);
          
          builder.addSectionTitle("Strategic Reasoning");
          builder.addParagraph(aiContent.strategicReasoning);
      }

      builder.printData(data); // The raw inputs
      builder.save("Tokenomics_Blueprint.pdf");
  },

  generateDistributionBlueprintPDF: (data: any, aiContent: any) => {
      const builder = new PdfBuilder("Go-To-Market & Distribution");
      
      if (aiContent) {
          builder.addSectionTitle("Strategy Executive Summary");
          builder.addParagraph(aiContent.executiveSummary);
      }

      builder.printData(data);
      builder.save("Distribution_Blueprint.pdf");
  },

  generatePayoutTreasuryPDF: (data: any, aiContent: any) => {
    const builder = new PdfBuilder("Payout & Treasury Operations");
    
    if (aiContent) {
         builder.addSectionTitle("Operational Verdict");
         builder.addParagraph(aiContent.institutionalVerdict);
    }
    
    builder.printData(data);
    builder.save("Payout_Treasury_Strategy.pdf");
  },

  generateDecisionMatrixPDF: (matrixData: any, aiSynthesis: any) => {
     const builder = new PdfBuilder("Structural Decision Matrix");
     
     if (aiSynthesis) {
         builder.addSectionTitle("Advisor Synthesis");
         builder.addKeyValue("Final Verdict", aiSynthesis.advisorConclusion?.status);
         builder.addParagraph(aiSynthesis.advisorConclusion?.condition);
         builder.addParagraph(aiSynthesis.narrative);
     }

     builder.printData(matrixData);
     builder.save("Decision_Matrix.pdf");
  },

  generateFinalMasterReport: (reportData: any, projectInfo: any, isDraft: boolean) => {
      const builder = new PdfBuilder(`Investment Memorandum - ${isDraft ? 'DRAFT' : 'FINAL'}`);
      
      // Cover Page Info
      builder.addKeyValue("Project", projectInfo.projectName);
      builder.addKeyValue("Date", new Date().toLocaleDateString());
      builder.addKeyValue("Status", isDraft ? "Internal Review" : "Investment Ready");
      builder.y += 20;

      // Render the AI Generated Sections
      if (reportData.finalReport && reportData.finalReport.sections) {
          reportData.finalReport.sections.forEach((sec: any) => {
              builder.addSectionTitle(sec.title);
              builder.addParagraph(sec.content);
              builder.y += 10;
          });
      }

      // Append Risks if separate
      if (reportData.readiness) {
          builder.addSectionTitle("Readiness Assessment");
          builder.addKeyValue("Score", `${reportData.readiness.score}/100`);
          builder.addKeyValue("Verdict", reportData.readiness.verdict);
      }

      builder.save(`IM_${projectInfo.projectName || 'Project'}_${isDraft ? 'Draft' : 'Final'}.pdf`);
  },

  generateBuildProjectRealPDF: (projectData: any, narrative: any) => {
    const builder = new PdfBuilder("Strategic Advisory Report");

    // 1. Executive Advisory
    builder.addSectionTitle("1. Executive Advisory");
    builder.addParagraph(narrative?.narrative || "Analysis pending...");
    builder.y += 10;

    // 2. Snapshot
    if (projectData.snapshot) {
        builder.addSubTitle("Project Snapshot");
        builder.addKeyValue("Name", projectData.snapshot.inputs?.projectName);
        builder.addKeyValue("Objective", projectData.snapshot.inputs?.objective);
        if (projectData.snapshot.result) {
             builder.addParagraph(projectData.snapshot.result.professionalSummary);
        }
    }

    // 3. Capital Stack
    if (projectData.capitalStack?.result) {
        builder.addSectionTitle("2. Capital Stack Structure");
        builder.addSubTitle("Alignment Analysis");
        builder.addParagraph(projectData.capitalStack.result.alignmentAnalysis);
        
        builder.addSubTitle("Conflict Points");
        (projectData.capitalStack.result.conflictPoints || []).forEach((pt: string) => {
             builder.addParagraph(`• ${pt}`);
        });
    }

    // 4. Tokenomics
    if (projectData.tokenomics?.result) {
        builder.addSectionTitle("3. Token Economics");
        builder.addSubTitle("Psychology Check");
        builder.addParagraph(projectData.tokenomics.result.psychologyCheck);
        
        builder.addSubTitle("Liquidity Simulation");
        builder.addParagraph(projectData.tokenomics.result.liquiditySimulation);
    }

    // 5. Risks
    if (projectData.riskReality?.result?.realRisks) {
        builder.addSectionTitle("4. Risk Reality Check");
        projectData.riskReality.result.realRisks.forEach((r: any) => {
            builder.addSubTitle(`Risk: ${r.risk} (${r.impact})`);
            builder.addParagraph(`Mitigation: ${r.mitigation}`);
        });
    }

    // 6. Execution
    if (projectData.execution?.result) {
        builder.addSectionTitle("5. Execution");
        builder.addKeyValue("Primary Bottleneck", projectData.execution.result.bottleneck);
        builder.addKeyValue("Realistic Timeline", projectData.execution.result.realTimeline);
    }

    // 7. Checklist
    if (projectData.nextActions?.result?.actions) {
        builder.addSectionTitle("6. Operational Checklist");
        projectData.nextActions.result.actions.forEach((a: any) => {
             builder.addParagraph(`[ ] ${a.step} (Owner: ${a.owner})`);
        });
    }

    builder.save("Strategic_Advisory_Report.pdf");
  }
};
