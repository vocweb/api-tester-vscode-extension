import React, { useEffect } from "react";
import styled from "styled-components";
import shallow from "zustand/shallow";

import Loader from "../../../components/Loader";
import { COMMON, RESPONSE } from "../../../constants";
import useResponseDataStore from "../../../store/useResponseDataStore";
import ResponseEmptyMenu from "../Empty/ResponseEmptyMenu";
import ResponseErrorMenu from "../Error/ResponseErrorMenu";
import ResponseMenu from "../Menu/ResponseMenu";

const ResponsePanel = () => {
  const {
    responseData,
    requestInProcess,
    handleResponseData,
    handleRequestProcessStatus,
  } = useResponseDataStore(
    (state) => ({
      responseData: state.responseData,
      requestInProcess: state.requestInProcess,
      handleResponseData: state.handleResponseData,
      handleRequestProcessStatus: state.handleRequestProcessStatus,
    }),
    shallow,
  );

  const handleExtensionMessage = (event) => {
    if (event.data.type === RESPONSE.RESPONSE) {
      handleResponseData(event.data);
      handleRequestProcessStatus(COMMON.FINISHED);
    } else if (event.data.type === RESPONSE.ERROR) {
      handleResponseData(event.data);
      handleRequestProcessStatus(RESPONSE.ERROR);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
  }, []);

  switch (requestInProcess) {
    case COMMON.LOADING:
      return <Loader />;
    case COMMON.FINISHED:
      return (
        <ResponsePanelWrapper>
          <ResponseMenu />
        </ResponsePanelWrapper>
      );
    case RESPONSE.ERROR:
      return (
        <ResponsePanelWrapper>
          <ResponseErrorMenu {...responseData} />
        </ResponsePanelWrapper>
      );
    default:
      return (
        <ResponsePanelWrapper>
          <ResponseEmptyMenu />
        </ResponsePanelWrapper>
      );
  }
};

const ResponsePanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.1rem 4.5rem 1.5rem 4.5rem;
`;

export default ResponsePanel;
