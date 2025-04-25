import Img from "components/Img";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { useState } from "react";
import NewMenuItemModal, { IMenuItem } from "./NewMenuItemModal";
import { deleteMenuItem, fetchPlace } from "store/places-actions";
import IPlace from "types/IPlace";

interface MenuItemProps {
  name: string;
  price?: number;
  description?: string;
  image?: string;
  isOwner: boolean;
  onEdit: () => void;
}

const MenuItem = ({
  name,
  price,
  description,
  image,
  isOwner,
  onEdit,
}: MenuItemProps) => {
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="text font-semibold text-gray-700">{name}</div>
        {!!price && <div className="text-sm text-gray-500">{price} zl</div>}
        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
        {isOwner && (
          <div
            className="flex cursor-pointer text-sm font-semibold text-blue-600"
            onClick={onEdit}
          >
            Edit
          </div>
        )}
      </div>
      {image && (
        <div className="h-20 w-24 ">
          <Img
            src={`/${image}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

const Menu = () => {
  const menu = useAppSelector((state) => state.places.focused?.menu);
  const [modalOpen, setModalOpen] = useState(false);
  const placeId = useAppSelector((state) => state.places.focused?.id);
  const ownerId = useAppSelector((state) => state.places.focused?.createdBy.id);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState<IMenuItem>();

  const isOwner = user?.id === ownerId;

  const onCloseModalHandler = () => {
    dispatch(fetchPlace(placeId!));
    setModalOpen(false);
    setEditing(undefined);
  };

  const onEditMenuItemHandler = (menuItem: IMenuItem) => {
    setEditing(menuItem);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      {menu?.length === 0 && (
        <div className="font-semibold text-gray-400">
          No menu items added yet!
        </div>
      )}
      {isOwner && (
        <button
          className="rounded text-sm font-semibold text-gray-400 hover:underline"
          onClick={() => setModalOpen(true)}
        >
          Click to add new menu item.
        </button>
      )}
      {menu?.map((menuItem) => (
        <MenuItem
          key={menuItem.id}
          {...menuItem}
          isOwner={isOwner}
          onEdit={() => onEditMenuItemHandler(menuItem)}
        />
      ))}
      {modalOpen && (
        <NewMenuItemModal
          placeId={placeId!}
          onClose={onCloseModalHandler}
          editing={editing}
        />
      )}
    </div>
  );
};

export default Menu;
