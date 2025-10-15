import { render, screen } from "@testing-library/angular";
import userEvent from "@testing-library/user-event";
import { LoginFormMolecule } from "./login-form.molecule";

describe("LoginFormMolecule", () => {
  it("emits login when fields are filled", async () => {
    const { fixture } = await render(LoginFormMolecule);
    const user = userEvent.setup();
    const username = screen.getByPlaceholderText("e.g. alice") as HTMLInputElement;
    const password = screen.getByPlaceholderText("â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢") as HTMLInputElement;
    await user.type(username, "alice");
    await user.type(password, "secret");
    const btn = screen.getByText("Login");
    const spy = jest.spyOn(fixture.componentInstance.login, "emit");
    await user.click(btn);
    expect(spy).toHaveBeenCalledWith({ username: "alice", password: "secret" });
  });
});
