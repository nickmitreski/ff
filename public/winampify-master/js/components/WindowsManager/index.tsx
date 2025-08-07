import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeImage } from "../../actions/images";
import { setOnTop } from "../../actions/windows";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import { Window, WINDOW_TYPE } from "../../reducers/windows";
import { selectExplorers, selectImages } from "../../selectors/explorer";
import { selectWindows } from "../../selectors/windows";
import { ImageDialogType } from "../../types";
import { findHighestPosition } from "../../utils/windows";
import Explorer from "../Explorer";
import ImageModal from "../ImageDialog";
import WindowInstance from "./WindowInstance";

export default () => {
  const webampObject = useSelector(
    (state: AppState) => state.webamp.webampObject
  );

  const images = useSelector<AppState, ImageDialogType[]>(selectImages);
  const explorers = useSelector<AppState, SingleExplorerState[]>(
    selectExplorers
  );
  const windows = useSelector<AppState, Window[]>(selectWindows);

  const dispatch = useDispatch();

  const getWindow = (window: Window, index: number) => {
    const webampNode = document.getElementById("webamp");
    switch (window.type) {
      case WINDOW_TYPE.Webamp: {
        if (!webampNode) return;
        if (window.minimized) {
          webampNode.style.overflow = "hidden";
        } else {
          webampNode.style.overflow = "visible";
        }
        webampNode.style.zIndex = window.position.toString();
        return null;
      }
      case WINDOW_TYPE.Explorer: {
        if (window.minimized) return;
        const explorer = explorers.find(
          explorerElement => explorerElement.id === window.id
        );
        if (explorer !== undefined)
          return <Explorer key={explorer.id} explorer={explorer} />;
      }
      case WINDOW_TYPE.Image: {
        if (window.minimized) return;
        const image = images.find(img => img.id === window.id);
        if (image !== undefined) {
          return (
            <ImageModal
              key={window.id}
              image={image}
              onDismiss={() => dispatch(closeImage(window.id))}
            />
          );
        }
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    // tslint:disable-next-line: no-console
    document.addEventListener(
      "mousedown",
      (evt: MouseEvent) => {
        // @ts-ignore
        const path = evt.path || (evt.composedPath && evt.composedPath());
        if (path.some((el: HTMLDivElement) => el.id === "webamp")) {
          dispatch(setOnTop("webamp"));
        }
      },
      // If the clicked element doesn't have the right selector, bail
      false
    );
  }, []);

  return (
    <>
      {windows.map((window: Window, index) => {
        return (
          <WindowInstance
            key={window.id}
            id={window.id}
            zIndex={window.position}
            isOnTop={window.position === findHighestPosition(windows)}
            setOnTop={() => dispatch(setOnTop(window.id))}
          >
            {getWindow(window, index)}
          </WindowInstance>
        );
      })}
    </>
  );
};
