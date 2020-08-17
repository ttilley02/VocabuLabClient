import React from "react";
import TokenService from "../services/token-service";
import "../App.css";
import config from "../config";
import { Textarea } from "../components/utils";
import Context from "../context";
import ValidationError from "../components/ValidationError";

export default class AddNote extends React.Component {
  static contextType = Context;

  validateNote() {
    const name = this.context.noteName.value.trim();
    if (name.length === 0) {
      return "Note Required";
    } else if (name.length > 100) {
      return "Note must be less than 100 characters in length";
    }
  }

  //adds note to the database for the current card
  handleSubmit = (ev) => {
    const { text } = ev.target;
    ev.preventDefault();
    fetch(`${config.API_ENDPOINT}/api/notes/`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        card_id: this.props.match.params.cardId,
        note: text.value
      })
    }).then(() => {
      this.props.history.push("/profile");
    });
  };

  //create the text field for when you decide to enter a note
  render() {
    console.log(this.context.noteName.value);
    console.log(this.context.noteName.value.trim());
    return (
      <form className="ReviewForm" onSubmit={this.handleSubmit}>
        <div className="text">
          {this.context.noteName.touched && (
            <ValidationError message={this.validateNote()} />
          )}
          <Textarea
            required
            aria-label="Type your notes..."
            name="text"
            id="text"
            cols="30"
            rows="3"
            placeholder="Type your notes..."
            value={this.context.noteName.value}
            onChange={this.context.updateAddNoteName}
          ></Textarea>
        </div>
        <button type="submit">Add note</button>
      </form>
    );
  }
}
