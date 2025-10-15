describe("Login & Products flow", () => {
  it("logs in and shows products", () => {
    cy.visit("/login");
    cy.contains("Welcome back");
    cy.get('input[placeholder="e.g. alice"]').type("alice");
    cy.get('input[placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"]').type("password");
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: { accessToken: "ACCESS", refreshToken: "REFRESH", expiresIn: 3600 }
    }).as("login");
    cy.get("button").contains("Login").click();
    cy.wait("@login");
    cy.intercept("GET", "**/api/products", {
      statusCode: 200,
      body: [
        { category:"Books", productCode:"P01", name:"Angular In Action", imageUrl:"/images/p01.jpg", price:30, minimumQuantity:1, discountRate:10 },
        { category:"Electronics", productCode:"P02", name:"Wireless Mouse", imageUrl:"/images/p02.jpg", price:15, minimumQuantity:1, discountRate:0 }
      ]
    }).as("products");
    cy.visit("/products");
    cy.wait("@products");
    cy.contains("Angular In Action");
    cy.contains("Wireless Mouse");
  });
});
