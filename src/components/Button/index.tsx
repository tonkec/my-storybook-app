import React, { useState, useRef, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import {useFloating, shift, limitShift, arrow} from '@floating-ui/react-dom';

type Status = 'initial' | 'loading' | 'error'

const statusColor: Record<Status, string> = {
     initial: 'black',
     loading: 'orange',
     error: 'red'
}

interface StyledButtonProps extends ComponentProps<'button'> {
     $status: Status
}

const StyledButton = styled.button<StyledButtonProps>`
     display: inline-block;
     border: 2px solid;
     background-color: #fff;
     ${({ $status }) => css`
          border-color: ${statusColor[$status]}; 
          color: ${statusColor[$status]};
     `};
`

interface StyledArrowProps extends ComponentProps<'div'> {
     $status: Status
}

const StyledArrow =  styled.div<StyledArrowProps>`
     position: absolute;
     width: 10px;
     height: 10px;
     background-color: #292929;
     transform: rotate(45deg);
     ${({ $status }) => css`
          background-color: ${statusColor[$status]}; 
     `};
`

interface ButtonProps {
     title?: string;
     disabled?: boolean;
     children?: React.ReactNode;
     onClick: () => void | Promise<void>;
}

const Button = ({ disabled, children, onClick }: ButtonProps) => {
     const arrowRef = useRef<HTMLDivElement>(null);
     const {x, y, reference, floating, strategy, middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},} = useFloating({
          placement: 'bottom',
          middleware: [
               arrow({
                    element: arrowRef,
               }),
               shift({
                    limiter: limitShift({
                         offset: {
                              crossAxis: 65,
                         }
                    }),
               }),
     ],
        });
     const [status, setStatus] = useState<Status>("initial");
     const handleOnChange = async () => {
          setStatus("loading")
          await onClick()
          setStatus("initial")  
     }

     return (
          <>
               <StyledButton ref={reference} type="button" onClick={handleOnChange} $status={status}>
                    {status === 'loading' ? "Launching..." : children}
               </StyledButton>
               {!disabled && <div
                    ref={floating}
                    role="tooltip"
                    style={{
                         position: strategy,
                         top: y ?? '',
                         left: x ?? '',
                         backgroundColor: status === "initial" ? "#292929" : statusColor[status],
                         color: "#fff",
                         padding: 10
                    }}
               >
                    {status}
                <StyledArrow $status={status} style={{
                         top: arrowY ?? '-5px',
                         left: arrowX ?? '',
                    }} ref={arrowRef} />
               </div>
               }
          </>
          
     )
}

export default Button;

