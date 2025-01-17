import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { changeEmail } from "discourse/lib/user-activation";
import ActivationResent from "./activation-resent";
import { extractError } from "discourse/lib/ajax-error";

export default class ActivationEdit extends Component {
  @service login;
  @service modal;

  @tracked newEmail = this.args.model.newEmail;
  @tracked flash;

  get submitDisabled() {
    return this.newEmail === this.args.model.currentEmail;
  }

  @action
  async changeEmail() {
    try {
      await changeEmail({
        username: this.login?.loginName,
        password: this.login?.loginPassword,
        email: this.args.model.newEmail,
      });

      this.modal.show(ActivationResent, {
        model: { currentEmail: this.args.model.newEmail },
      });
    } catch (e) {
      this.flash = extractError(e);
    }
  }

  @action
  updateNewEmail(e) {
    this.newEmail = e.target.value;
  }
}
