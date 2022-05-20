import React, { useEffect, useState } from 'react';
import { eSubscribeEvent, eUnSubscribeEvent } from '../../../services/event-manager';
import { useSettingStore } from '../../../stores/use-setting-store';
import { useThemeStore } from '../../../stores/use-theme-store';
import { history } from '../../../utils';
import { PressableButton } from '../../ui/pressable';
import { ActionStrip } from './action-strip';
import { Filler } from './back-fill';
import { SelectionIcon } from './selection';

const SelectionWrapper = ({ children, item, background, onLongPress, onPress, testID }) => {
  const colors = useThemeStore(state => state.colors);
  const [actionStrip, setActionStrip] = useState(false);
  const notebooksListMode = useSettingStore(state => state.settings.notebooksListMode);
  const notesListMode = useSettingStore(state => state.settings.notesListMode);
  const listMode = item.type === 'notebook' ? notebooksListMode : notesListMode;
  const compactMode = (item.type === 'notebook' || item.type === 'note') && listMode === 'compact';

  const _onLongPress = () => {
    if (history.selectedItemsList.length > 0) return;
    setActionStrip(!actionStrip);
  };

  const _onPress = async () => {
    if (actionStrip) {
      setActionStrip(false);
      return;
    }
    await onPress();
  };

  const closeStrip = () => {
    setActionStrip(false);
  };

  useEffect(() => {
    eSubscribeEvent('navigate', closeStrip);

    return () => {
      eUnSubscribeEvent('navigate', closeStrip);
    };
  }, []);

  return (
    <PressableButton
      customColor="transparent"
      testID={testID}
      onLongPress={_onLongPress}
      onPress={_onPress}
      customSelectedColor={colors.transGray}
      customAlpha={!colors.night ? -0.02 : 0.02}
      customOpacity={1}
      customStyle={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderRadius: 0,
        overflow: 'hidden',
        paddingHorizontal: 12,
        paddingVertical: compactMode ? 8 : 12
      }}
    >
      {item.type === 'note' ? <Filler background={background} item={item} /> : null}
      <SelectionIcon
        compactMode={compactMode}
        setActionStrip={setActionStrip}
        item={item}
        onLongPress={onLongPress}
      />
      {children}

      {actionStrip ? <ActionStrip note={item} setActionStrip={setActionStrip} /> : null}
    </PressableButton>
  );
};

export default SelectionWrapper;
