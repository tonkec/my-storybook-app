import React from 'react'
import Button from './index';
import { DEFAULT_URL, callFetch } from '../../utils';

// eslint-disable-next-line
export default {
     title: 'Button',
     component: Button,
     argTypes: {
          backgroundColor: {control: 'color'},
     },
     args: {
          primary: true,
     }
}

export const Basic = () => {
     return (
          <Button 
               onClick={async () => {
                    await new Promise<void>((resolve, reject) => {
                         setTimeout(async () => {
                              await callFetch({ url: `${DEFAULT_URL}/` });
                              resolve();
                         }, 1000);
                    })
               }}
          >
               Launch Rocket
          </Button>
     )
}