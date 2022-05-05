import Button, { Status } from './index';
import { DEFAULT_URL } from '../../utils';
import type { ComponentMeta } from "@storybook/react"

const meta: ComponentMeta<typeof Button> = {
     title: 'Button',
     component: Button,
     argTypes: {
          url: {control: 'text'},
          disabled: { control: 'boolean' },
          status: {
               control: { type: 'radio' },
               options: ["initial", "loading", "error"]
          }
     },
     args: {
          disabled: false,
          url: DEFAULT_URL
     }
}

export default meta

interface Args {
     url: string;
     disabled: boolean;
     status?: Status;
}

export const Basic = (args: Args) => {
     return (
          <Button maxDuration={3000}
               {...args}
          >
               Launch Rocket
          </Button>
     )
}