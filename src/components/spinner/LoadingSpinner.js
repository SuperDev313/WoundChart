import classnames from 'classnames'
import { CardText } from "reactstrap";

const LoadingSpinner = ({ className }) => {
  return (
    <div
      className={classnames('fallback-spinner', {
        [className]: className
      })}
    >
      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export const DefaultLoader = () => {
  return (
    <>
      <LoadingSpinner />
      <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
    </>
  );
};

export default LoadingSpinner
