Feature: Self Service Registration with Email Activation and optional SMS

Background:
  Given a Policy that defines "Profile Enrollment"
    And with a Policy Rule that defines "collecting default attributes"
    And a user named "Mary"
    And she does not have account in the org

Scenario: Mary signs up for an account with Password, setups up required Email factor, then skips optional SMS
  When she clicks the 'signup' button
  Then she is redirected to the "Self Service Registration" page
  When she fills out her First Name
  And she fills out her Last Name
  And she fills out her Email
  And she submits the form
  Then she sees the Select Authenticator page with password as the only option
  When she chooses password factor option
  Then she sees the set new password form
  And she fills out her Password
  And she confirms her Password
  And she submits the set new password form
  Then she sees a list of available factors to setup
  When she selects Email
  Then she sees a page to input a code for email authenticator enrollment
  When she inputs the correct code from her "Email"
  And she submits the form
  Then she sees a list of factors to register
  When she selects "Skip" on SMS
  Then she is redirected to the Root View
  And she sees a table with her profile info
  And the cell for the value of "email" is shown and contains her "email"

Scenario: Mary signs up for an account with Password, setups up required Email factor, And sets up optional SMS
  When she clicks the 'signup' button
  Then she is redirected to the "Self Service Registration" page
  When she fills out her First Name
    And she fills out her Last Name
    And she fills out her Email
    And she submits the form
  Then she sees the Select Authenticator page with password as the only option
  When she chooses password factor option
    # And she submits the select authenticator form
  Then she sees the set new password form
    And she fills out her Password
    And she confirms her Password
    And she submits the set new password form
  Then she sees a list of available factors to setup
  When she selects Email
  Then she sees a page to input a code for email authenticator enrollment
  When she inputs the correct code from her "Email"
    And she submits the form
  Then she sees a list of factors to register
  When She selects Phone from the list
    And She inputs a valid phone number
    And she submits the form
  Then the screen changes to receive an input for a code
  When she inputs the correct code from her "SMS"
    And she submits the form
  Then she is redirected to the Root View
    And she sees a table with her profile info
    And the cell for the value of "email" is shown and contains her "email"

Scenario: Mary signs up with an invalid Email
  When she clicks the 'signup' button
  Then she is redirected to the "Self Service Registration" page
  When she fills out her First Name
  And she fills out her Last Name
  And she fills out her Email with an invalid email format
  And she submits the form
  Then she sees an error message "'Email' must be in the form of an email address"
  And she sees an error message "Provided value for property 'Email' does not match required pattern"

Scenario: Mary signs up for an account with Password, sets up required Email factor, And sets up optional SMS with an invalid phone number
  When she clicks the 'signup' button
  Then she is redirected to the "Self Service Registration" page
  When she fills out her First Name
  And she fills out her Last Name
  And she fills out her Email
    And she submits the form
  Then she sees the Select Authenticator page with password as the only option
  When she chooses password factor option
  # And she submits the select authenticator form
  Then she sees the set new password form
  And she fills out her Password
  And she confirms her Password
  And she submits the form
  Then she sees a list of available factors to setup
  When she selects Email
  Then she sees a page to input a code for email authenticator enrollment
  When she inputs the correct code from her "Email"
    And she submits the form
  Then she sees a list of factors to register
  When She selects Phone from the list
  And she inputs an invalid phone number
  And she submits the form
  Then she should see an error message "Invalid Phone Number."
