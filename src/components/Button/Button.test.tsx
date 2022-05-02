import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import Button from '.'

describe('Sexy Button', () => {
  it("should change backgroundColor on click", () => {
    let clickResolve = () => {}
    render(
      <Button onClick={async () => {
        await new Promise<void>((resolve) => {
          clickResolve = resolve
        })
      }}>
        Launch Rocket
      </Button>
    )
    const button = screen.getByRole("button")
    user.click(button)
    expect(button).toHaveStyle('border-color: orange')
    clickResolve()
  })
})