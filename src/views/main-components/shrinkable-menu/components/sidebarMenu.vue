<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="item.path">
                <Icon :type="item.icon" :size="iconSize" :key="item.path"></Icon>
                <span class="layout-text" :key="item.path">{{ itemTitle(item) }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.path">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                     <MenuItem v-if="!child.children" :name="child.name" :key="child.path">
                        <Icon :type="child.icon" :size="iconSize" :key="child.path"></Icon>
                        <span class="layout-text" :key="child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
<!--                 <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="child.name"></Icon>
                        <span class="layout-text" :key="child.name">{{ child.title }}</span>
                    </MenuItem>
                     </template> -->
                    <Submenu v-if="child.children" :name="child.name" :key="child.path">
                        <template slot="title">
                             <Icon :type="child.icon" :size="iconSize"></Icon>
                            <span class="layout-text">{{ itemTitle(child) }}</span>
                        </template>
                         <template v-for="childs in item.children.children">
                             <MenuItem :name="childs.name" :key="childs.name">
                                <Icon :type="childs.icon" :size="iconSize" :key="childs.name"></Icon>
                                <span class="layout-text" :key="childs.name">{{ childs.title }}</span>
                             </MenuItem>
                         </template>
                    </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
