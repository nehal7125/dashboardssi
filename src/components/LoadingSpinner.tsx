import { Flex, Spin } from "antd";

// Loading component to avoid repetition
const LoadingSpinner = () => (
    <Flex style={{ height: '60vh' }} align="center" justify="center">
      <Spin size="large" />
    </Flex>
  );

  export default LoadingSpinner;