describe("Dashboard Page", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/dashboard");
      cy.wait(500)
    });

    it("should load dashboard successfully", () => {
      cy.contains("Top Languages").should("exist");
      cy.contains("Top Activities").should("exist");
      cy.contains("Top Stats").should("exist");
      cy.contains("Activity Totals").should("exist");
      cy.contains("sessions tracked").should("exist");
      cy.contains("intervals logged").should("exist");
      cy.contains("languages used").should("exist");
      cy.contains("hours total").should("exist");
      cy.contains("repos").should("exist");
      cy.contains("commits").should("exist");
      cy.contains("submissions").should("exist");
      cy.contains("solutions").should("exist");
    });

    it("should render the GitHub line chart and LeetCode pie chart", () => {
      cy.get("canvas").should("have.length.at.least", 2);
    });

    it("should show GitHub username and followers", () => {
      cy.get('[class*="socialRow"]').contains("followers");
    });

    it("should show LeetCode username and views", () => {
      cy.get('[class*="socialRow"]').contains("views");
    });
  });
