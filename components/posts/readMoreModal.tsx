import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface ReadMoreModalProps {
    title: string;
    content: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const ReadMoreModal: React.FC<ReadMoreModalProps> = ({ title, content, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    {content}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReadMoreModal;