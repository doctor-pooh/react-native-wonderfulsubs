package com.wonderfulsubs;

import android.os.Bundle;
import com.facebook.react.ReactFragmentActivity;
import android.view.KeyEvent; // <--- import
import com.github.kevinejohn.keyevent.KeyEventModule; // <--- import
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactFragmentActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "WonderfulSubs";
  }

  @Override // <--- Add this method if you want to react to keyDown
  public boolean onKeyDown(int keyCode, KeyEvent event) {

    // A. Prevent multiple events on long button press
    // In the default behavior multiple events are fired if a button
    // is pressed for a while. You can prevent this behavior if you
    // forward only the first event:
    // if (event.getRepeatCount() == 0) {
    // KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
    // }
    //
    // B. If multiple Events shall be fired when the button is pressed
    // for a while use this code:
    // KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
    //
    // Using B.
    KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);

    // There are 2 ways this can be done:
    // 1. Override the default keyboard event behavior
    // super.onKeyDown(keyCode, event);
    // return true;

    // 2. Keep default keyboard event behavior
    // return super.onKeyDown(keyCode, event);

    // Using method #1 without blocking multiple
    
    return super.onKeyDown(keyCode, event);
  }

  @Override // <--- Add this method if you want to react to keyUp
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);

    // There are 2 ways this can be done:
    // 1. Override the default keyboard event behavior
    // super.onKeyUp(keyCode, event);
    // return true;

    // 2. Keep default keyboard event behavior
    // return super.onKeyUp(keyCode, event);

    // Using method #1
    
    return super.onKeyUp(keyCode, event);
  }

  // @Override
  // public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
  //   KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);
  //   return super.onKeyMultiple(keyCode, repeatCount, event);
  // }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
