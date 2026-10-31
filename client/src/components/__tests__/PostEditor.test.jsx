import { render, screen } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event"; 
import { MemoryRouter } from "react-router-dom"; 
import { vi, test, expect, beforeEach } from "vitest"; 
import { PostEditor } from "../PostEditor"; 
import * as auth from "../../lib/auth";

beforeEach(() => { 
  global.fetch = vi.fn(); 
  vi.spyOn(auth, "getUser").mockReturnValue({ id: "test-user-id" });
  vi.spyOn(auth, "getToken").mockReturnValue("test-token");
}); 

test("shows an error message anchored to the form when publish fails", async () => { 
  global.fetch.mockResolvedValue({ 
    ok: false, 
    json: async () => ({ error: { message: "Title is required." } }), 
  }); 

  render(<PostEditor />, { wrapper: MemoryRouter }); 
  await userEvent.type(screen.getByLabelText(/body/i), "Some content"); 
  await userEvent.click(screen.getByRole("button", { name: /publish/i })); 

  expect(await screen.findByRole("alert")).toHaveTextContent("Title is required."); 
}); 