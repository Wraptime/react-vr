/**
 * Copyright (c) 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// Selects controls based on platform and vr, applying them to object:
// from DeviceOrientation for mobile, Pointer Lock on PC. Also applies VRControls.

import DeviceOrientationControls from './DeviceOrientationControls';
import MousePanControls from './MousePanControls';
import VRControls from './VRControls';

export default class AppControls {
  constructor(camera, target) {
    this._camera = camera;
    this.nonVRControls = DeviceOrientationControls.isSupported()
      ? new DeviceOrientationControls(camera)
      : new MousePanControls(camera, target);
  }

  setVRDisplay(vrDisplay) {
    if (!vrDisplay) {
      throw new Error('When calling setVRDisplay a non-null value is expected.');
    }
    this.vrControls = new VRControls(this._camera, vrDisplay);
  }

  setCamera(camera) {
    this._camera = camera;
    this.nonVRControls.camera = camera;
    this.nonVRControls.resetRotation(camera.rotation.x, camera.rotation.y, camera.rotation.z);
    if (this.vrControls) {
      this.vrControls.camera = camera;
    }
  }

  resetRotation(x, y, z) {
    this.nonVRControls.resetRotation(x, y, z);
  }

  frame(frameOptions) {
    if (this.vrControls) {
      const display = this.vrControls.vrDisplay;
      if (display && display.isPresenting) {
        return this.vrControls.update(frameOptions);
      }
    }
    this.nonVRControls.update(frameOptions);
  }
}
