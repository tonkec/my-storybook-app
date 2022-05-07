import React, { useState, useRef, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import {shift, limitShift, arrow} from '@floating-ui/react-dom';
import { callFetch } from '../../utils';
import {useInteractions, useHover, useFloating} from '@floating-ui/react-dom-interactions'; 

export type Status = 'initial' | 'loading' | 'error' | 'timeout'

const statusColor: Record<Status, string> = {
     initial: 'black',
     loading: 'orange',
     error: 'red',
     timeout: "red"
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
     disabled?: boolean;
     children?: React.ReactNode;
     status?: Status;
     url: string;
     maxDuration?: number;
}

const Button = ({ disabled, children, url, status: manualStatus, maxDuration }: ButtonProps) => {
     const [tooltipOpen, setTooltipOpen] = useState(false);
     const arrowRef = useRef<HTMLDivElement>(null);
     const {x, y, reference, floating, strategy, middlewareData: {arrow: {x: arrowX, y: arrowY} = {}}, context} = useFloating({
          open: tooltipOpen,
          onOpenChange: setTooltipOpen,
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
     const {getReferenceProps, getFloatingProps} = useInteractions([
          useHover(context, {
            enabled: !disabled
          }),
     ]);        
     const [stateStatus, setStatus] = useState<Status>("initial");
     const status = manualStatus ? manualStatus : stateStatus; 

     const handleOnChange = async () => {   
          setStatus((previousStatus) => {
               if (previousStatus === "loading") {
                    return "error"
               }
               return "loading"
          })

          if (typeof maxDuration === "undefined") {
               await callFetch({ url: `${url}/` });

                 if (stateStatus === "error") {
                    return;
               }
     
               setStatus((previousStatus) =>  {
                    if (previousStatus === "error") {
                         return previousStatus;
                    }
     
                    return "initial";
               }) 
               return;
          }


          const controller = new AbortController()

          setTimeout(() => {
               controller.abort()
          }, maxDuration)

          try {
               const { error } = await callFetch({ url: `${url}/`, signal: controller.signal });;
               //  @ts-ignore
               if (error.type === 'abort') throw error
     
               setStatus((previousStatus) =>  {
                    if (previousStatus === "error") {
                         return previousStatus;
                    }
     
                    return "initial";
               }) 
          } catch (e) {
               setStatus("timeout");
          }
     }

     return (
          <>
               <StyledButton {...getReferenceProps({ref: reference})} type="button" onClick={handleOnChange} $status={status}>
                    {status === 'loading' ? "Launching..." : children}
               </StyledButton>
               {!disabled && (tooltipOpen || status === "error" ) && <div
                    ref={floating}
                    role="tooltip"
                    {...getFloatingProps({
                         ref: floating,
                         style: {
                              position: strategy,
                              top: y ?? '',
                              left: x ?? '',
                              backgroundColor: status === "initial" ? "#292929" : statusColor[status],
                              color: "#fff",
                              padding: 10
                         },
                       })}                    
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

