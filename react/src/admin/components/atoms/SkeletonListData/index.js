import Gap from '../Gap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonListData({ width = 70, height = 20 }) {
    return (
        <>
            <SkeletonTheme highlightColor="#CFCFCF">
                <Skeleton height={height} width={width} count={1} />
            </SkeletonTheme>

            <Gap height={15} />
        </>
    )
}

export default SkeletonListData;