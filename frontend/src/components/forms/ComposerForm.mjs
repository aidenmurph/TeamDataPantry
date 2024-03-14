// Import dependencies
import React from 'react';
import { InputDate } from './inputs/InputDate.mjs'

function ComposerForm({ 
  firstName, setFirstname, 
  lastName, setLastName, 
  birthDate, setBirthDate, 
  deathDate, setDeathDate, 
  onSubmit }) 
{
  // Validate the input before calling the submission handler
  const handleSubmit = () => {
    // Check if all required fields are completed
    if (!firstName || !lastName || !birthDate) {
      alert("First Name, Last Name, and Birth Date are required.");
      return;
    }
    // Confirm birth date is not after death date
    if (deathDate && new Date(deathDate) < new Date(birthDate)) {
      alert("Death Date cannot occur before the Birth Date.");
      return;
    }

    // Submit the data to the handler
    onSubmit()
  }

  return (
    <>
      <table className="composerForm">
        <tbody>
          <tr>
            {/* First Name */}
            <td><label htmlFor="first-name">First Name: </label>
              <input 
                type="text" 
                name="first-name" 
                id="first-name" 
                className="add-input"
                value={firstName} 
                onChange={e => setFirstname(e.target.value)} 
                placeholder="First Name" />
            </td>

            {/* Last Name */}
            <td><label htmlFor="last-name">Last Name: </label>
              <input 
                type="text" 
                name="last-name" 
                id="last-name" 
                className="add-input"
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
                placeholder="Last Name" />
            </td>

            {/* Birth Date */}
            <td><label htmlFor="birthDate">Birth Date: </label>
              <InputDate 
                id={"birthDate"}
                value={birthDate}
                setValue={setBirthDate}
              />
            </td>

            {/* Death Date */}
            <td><label htmlFor="deathDate">Death Date: </label>
              <InputDate 
                id={"deathDate"}
                value={deathDate ? deathDate : ''}
                setValue={setDeathDate}
              />
            </td>
          </tr>

          {/* Submit Button */}
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              <button 
                name="submit-button" 
                type="submit"
                onClick={handleSubmit}
                id="submit"
              >Submit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export { ComposerForm }