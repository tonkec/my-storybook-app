import { render, screen, act } from '@testing-library/react'
import user from '@testing-library/user-event'
import Button from '.'
import {rest} from "msw";
import { setupServer} from "msw/node";
import {vi} from "vitest";
const URL = 'https://jsonplaceholder.typicode.com/todos';
const fakeData: any[] = [];
let clickResolve = () => {}
const server = setupServer(
  rest.get(URL, async (req, res, ctx) => {
    await new Promise<void>((res) => {
      clickResolve = res;
    })
    return res(
      ctx.json(
        fakeData
      )
    )
  }),
)
beforeAll(() => {
  server.listen();
})

afterAll(() => {
  server.close();
})

describe('Our cool Button', () => {
  it("should change style based on different status", () => {
  const {rerender} =  render(
      <Button url={URL}>
        Launch Rocket
      </Button>
    )
    const button = screen.getByRole("button")
    user.click(button)
    expect(button).toHaveStyle('border-color: orange')
    user.click(button)
    expect(button).toHaveStyle('border-color: red')
    rerender(
    <Button url={URL} status='loading'>
    Launch Rocket
    </Button>)
    expect(button).toHaveStyle('border-color: orange')

    clickResolve()
  })

  it("should have the correct tooltip", () => {
    const {rerender } = render(
      <Button url={URL}>
        Launch Rocket
      </Button>
    )
    const tooltip = screen.queryByRole("tooltip");
    expect(tooltip).not.toBeInTheDocument();
    user.hover(screen.getByRole("button"))
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    user.unhover(screen.getByRole("button"))
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    rerender(
      <Button url={URL} status="error">
        Launch Rocket
      </Button>
    )
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    rerender(
      <Button url={URL} disabled status="error">
        Launch Rocket
      </Button>
    )

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  })

  it.only("should timeout after maximum duration", () => {
    const maxDuration = 3000;
    const url = 'https://jsonplaceholder.typicode.com/posts'
    const server = setupServer(
      rest.get(url, async (req, res, ctx) => {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res();
          }, maxDuration + 50)
        })
        return res(
          ctx.json(
            fakeData
          )
        )
      }),
    )

    server.listen();

    render(
      <Button url={url} maxDuration={maxDuration}>
        Launch Rocket
      </Button>
    )

    vi.useFakeTimers();

    user.click(screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(maxDuration);
    })
    expect(screen.getByRole("button")).toHaveStyle('border-color: red')
    server.close();
    vi.useRealTimers()
  })
})