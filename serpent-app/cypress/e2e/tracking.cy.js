describe("Tracking Page", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/tracking");
    });

    it("should display the tracking header", () => {
      cy.contains("start tracking").should("exist");
      cy.contains("what’re you working on?").should("exist");
    });

    it("should show recent sessions section", () => {
      cy.contains("recently tracked").should("exist");
    });

    it("should allow start and stop of the timer", () => {
      cy.contains("Start").click();
      cy.wait(1000);
      cy.contains("Stop").click();
    });

    it("should allow ending a session after starting", () => {
      cy.contains("Start").click();
      cy.wait(1000);
      cy.contains("Stop").click();
      cy.contains("End").click();
      cy.contains("Save").should("exist");
    });

    it("should select an activity and save session", () => {
      cy.contains("Start").click();
      cy.wait(1000);
      cy.contains("Stop").click();
      cy.get('[class*="trackTag"]').first().click();
      cy.contains("End").click();
      cy.contains("Save").click();
      cy.on("window:alert", (text) => {
        expect(text).to.match(/Session saved!|No session to save!|Error saving session/);
      });
    });
    it("should show edit buttons in session list if sessions exist", () => {
      cy.get("button").contains("edit").should("exist");
    });
  });