import { ImageSourcePropType } from 'react-native';

export interface ImageAsset {
  uri: string;
  local: ImageSourcePropType;
}

export const CROP_IMAGES: Record<string, ImageAsset> = {
  tomato: {
    uri: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/tomato.jpg'),
  },
  onion: {
    uri: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/onion.jpg'),
  },
  paddy: {
    uri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/paddy.jpg'),
  },
  groundnut: {
    uri: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/groundnut.jpg'),
  },
  coconut: {
    uri: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/coconut.jpg'),
  },
  banana: {
    uri: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/banana.jpg'),
  },
  potato: {
    uri: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    local: require('../../assets/crops/potato.jpg'),
  },
};

export const AVATAR_IMAGES = {
  user: {
    uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    local: require('../../assets/crops/avatar_user.jpg'),
  },
  ravi: {
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    local: require('../../assets/crops/farmer_ravi.jpg'),
  },
  lakshmi: {
    uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    local: require('../../assets/crops/farmer_lakshmi.jpg'),
  },
  arun: {
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    local: require('../../assets/crops/farmer_ravi.jpg'),
  },
  sita: {
    uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    local: require('../../assets/crops/farmer_lakshmi.jpg'),
  },
};

export function getCropImageSource(cropId?: string): ImageSourcePropType {
  const normalized = (cropId || 'tomato').toLowerCase().trim();
  const found = CROP_IMAGES[normalized];
  if (found) {
    return found.local;
  }
  return CROP_IMAGES.tomato.local;
}

export function getCropImageUri(cropId?: string): string {
  const normalized = (cropId || 'tomato').toLowerCase().trim();
  const found = CROP_IMAGES[normalized];
  return found ? found.uri : CROP_IMAGES.tomato.uri;
}

export function getAvatarSource(nameOrKey?: string): ImageSourcePropType {
  const key = (nameOrKey || 'user').toLowerCase();
  if (key.includes('ravi')) return AVATAR_IMAGES.ravi.local;
  if (key.includes('lakshmi')) return AVATAR_IMAGES.lakshmi.local;
  if (key.includes('arun')) return AVATAR_IMAGES.arun.local;
  if (key.includes('sita')) return AVATAR_IMAGES.sita.local;
  return AVATAR_IMAGES.user.local;
}
