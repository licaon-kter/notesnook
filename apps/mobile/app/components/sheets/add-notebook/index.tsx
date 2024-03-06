/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Notebook } from "@notesnook/core";
import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { notesnook } from "../../../../e2e/test.ids";
import { db } from "../../../common/database";
import { DDS } from "../../../services/device-detection";
import {
  ToastManager,
  eSendEvent,
  presentSheet
} from "../../../services/event-manager";
import Navigation from "../../../services/navigation";
import { useMenuStore } from "../../../stores/use-menu-store";
import { useRelationStore } from "../../../stores/use-relation-store";
import { SIZE } from "../../../utils/size";
import { Button } from "../../ui/button";
import Input from "../../ui/input";
import Seperator from "../../ui/seperator";
import Heading from "../../ui/typography/heading";
import { MoveNotes } from "../move-notes/movenote";
import { eOnNotebookUpdated } from "../../../utils/events";
import { getParentNotebookId } from "../../../utils/notebooks";

export const AddNotebookSheet = ({
  notebook,
  parentNotebook,
  close
}: {
  notebook?: Notebook;
  parentNotebook?: Notebook;
  close: ((context?: string | undefined) => void) | undefined;
}) => {
  const title = useRef(notebook?.title);
  const description = useRef(notebook?.description);
  const titleInput = useRef<TextInput>(null);
  const descriptionInput = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const onSaveChanges = async () => {
    if (loading) return;
    setLoading(true);

    if (!title.current || title?.current.trim().length === 0) {
      ToastManager.show({
        heading: "Notebook title is required",
        type: "error",
        context: "local"
      });
      setLoading(false);
      return;
    }

    const id = await db.notebooks.add({
      title: title.current,
      description: description.current,
      id: notebook?.id
    });

    if (parentNotebook) {
      await db.relations.add(parentNotebook, {
        type: "notebook",
        id: id
      });
    }

    useMenuStore.getState().setMenuPins();
    Navigation.queueRoutesForUpdate();
    useRelationStore.getState().update();

    const parent =
      parentNotebook?.id || (await getParentNotebookId(notebook?.id || id));

    eSendEvent(eOnNotebookUpdated, parent);
    if (notebook) {
      setImmediate(() => {
        console.log(parent, notebook.id);
        eSendEvent(eOnNotebookUpdated, notebook.id);
      });
    }

    if (!notebook) {
      MoveNotes.present(await db.notebooks.notebook(id));
    } else {
      close?.();
    }
  };

  return (
    <View
      style={{
        maxHeight: DDS.isTab ? "90%" : "97%",
        borderRadius: DDS.isTab ? 5 : 0,
        paddingHorizontal: 12
      }}
    >
      <Heading size={SIZE.lg}>
        {notebook ? "Edit Notebook" : "New Notebook"}
      </Heading>

      <Seperator />

      <Input
        fwdRef={titleInput}
        testID={notesnook.ids.dialogs.notebook.inputs.title}
        onChangeText={(value) => {
          title.current = value;
        }}
        onLayout={() => {
          setImmediate(() => {
            titleInput?.current?.focus();
          });
        }}
        placeholder="Enter notebook title"
        onSubmit={() => {
          descriptionInput.current?.focus();
        }}
        returnKeyLabel="Next"
        returnKeyType="next"
        defaultValue={notebook ? notebook.title : ""}
      />

      <Input
        fwdRef={descriptionInput}
        testID={notesnook.ids.dialogs.notebook.inputs.description}
        onChangeText={(value) => {
          description.current = value;
        }}
        placeholder="Enter notebook description"
        returnKeyLabel="Next"
        returnKeyType="next"
        defaultValue={notebook ? notebook.description : ""}
      />

      <Button
        title={notebook ? "Save" : "Add"}
        type="accent"
        height={45}
        fontSize={SIZE.md}
        style={{
          paddingHorizontal: 24,
          width: "100%"
        }}
        onPress={onSaveChanges}
      />
    </View>
  );
};

AddNotebookSheet.present = (
  notebook?: Notebook,
  parentNotebook?: Notebook,
  context?: string,
  onClose?: () => void
) => {
  presentSheet({
    context: context,
    component: (ref, close) => (
      <AddNotebookSheet
        notebook={notebook}
        parentNotebook={parentNotebook}
        close={close}
      />
    ),
    onClose: onClose
  });
};
