import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { AppState } from "../../reducers";

interface Props {
  zIndex: number;
  isOnTop: boolean;
  setOnTop: () => void;
  children: ReactNode;
  id: string;
}

export default (props: Props) => {
  const dataTransferArray = useSelector((state: AppState) => {
    return state.dataTransfer.tracks;
  });
  const allowDrop = dataTransferArray.length;
  return (
    <Container
      key={props.id}
      zIndex={props.zIndex}
      onMouseDown={(e: any) => {
        if (!props.isOnTop && e.target.id !== "disallow-on-top")
          props.setOnTop();
      }}
      onDragEnter={(e: any) => {
        if (!props.isOnTop && e.target.id !== "disallow-on-top") {
          setTimeout(() => {
            props.setOnTop();
          }, 200);
        }
      }}
      isOnTop={props.isOnTop}
    >
      {props.children}
    </Container>
  );
};

const Container = styled.div<{ zIndex: number; isOnTop: boolean }>`
  z-index: ${props => props.zIndex};
  position: absolute;
  transition: filter 0.26s;
  ${props =>
    !props.isOnTop &&
    css`
      -webkit-filter: ${secondProps =>
        secondProps.theme.windows.bgOutFocus}; /* Safari 6.0 - 9.0 */
      filter: ${secondProps => secondProps.theme.windows.bgOutFocus};
    `}
`;
