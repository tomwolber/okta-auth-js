Feature: Root page for Direct Auth Demo Application

  Background:
    Given a Policy that defines "Authentication"
      And with a Policy Rule that defines "Password as the only factor"
      And a user named "Mary"
      And she has an account with "active" state in the org

  Scenario: Mary visits the Root View WITHOUT an authentcation session (no tokens)
    # Given Mary navigates to the Root View
    Then the Root Page shows links to the Entry Points
    
  Scenario: Mary visits the Root View and WITH an authentication session
    Given she is on the Root View in an AUTHENTICATED state
    # When Mary navigates to the Root View
    Then she sees a table with her profile info
      And the cell for the value of "email" is shown and contains her "email"
      And she sees the "logout" button

  Scenario: Mary logs out of the app
    Given she is on the Root View in an AUTHENTICATED state
      # And Mary navigates to the Root View
    When she clicks the "logout" button
    Then she is redirected back to the Root View
      And Mary sees login, registration buttons
      #And she sees that claims from /userinfo are disappeared
