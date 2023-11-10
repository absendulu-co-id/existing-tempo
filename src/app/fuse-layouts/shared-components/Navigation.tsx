import { FuseNavigation } from "@fuse";
import { RootState } from "app/store";
import clsx from "clsx";
import { useSelector } from "react-redux";

function Navigation(props) {
  const navigation = useSelector(({ fuse }: RootState) => fuse.navigation);
  const approvalCount = useSelector(({ auth }: RootState) => auth.user.data.approvalCount);

  if (navigation[0]?.children != null && approvalCount != null) {
    const approvalIndex = navigation[0].children.findIndex((x) => x.id == "approval");

    navigation[0].children[approvalIndex].badge = {
      title: approvalCount.all,
      bg: "red",
      fg: "white",
    };

    if (navigation[0].children[approvalIndex].children != null) {
      for (let i = 0; i < navigation[0].children[approvalIndex].children!.length; i++) {
        navigation[0].children[approvalIndex].children![i].badge = {
          title: approvalCount[navigation[0].children[approvalIndex].children![i].id],
          bg: "red",
          fg: "white",
        };
      }
    }
  }

  return (
    <FuseNavigation
      className={clsx("navigation", props.className)}
      navigation={navigation}
      layout={props.layout}
      dense={props.dense}
      active={props.active}
    />
  );
}

Navigation.defaultProps = {
  layout: "horizontal",
};

export default Navigation;
