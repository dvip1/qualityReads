import { Card, CardBody } from "@nextui-org/card";
const NothingToSeeHere: React.FC = () => {
    return (
        <Card
            className="h-52 min-w-52"
            isBlurred
            isPressable

        >
            <CardBody className="flex flex-col justify-center items-center">
                <p>Nothing to see here..</p>
            </CardBody>
        </Card>
    );
};

export default NothingToSeeHere;